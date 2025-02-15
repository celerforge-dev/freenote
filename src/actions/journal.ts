"use server";

import { db } from "@/lib/db";
import { noteTable, NoteType } from "@/lib/db/schema/note";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

function createJournalEntry(date: Date) {
  return {
    type: NoteType.journal,
    title: date.toLocaleDateString(),
    content: "",
    embedding: new Array(1536).fill(0),
    createdAt: date,
    updatedAt: date,
  };
}

export async function getJournal(date: Date) {
  return db.query.noteTable.findFirst({
    where: and(
      eq(noteTable.type, NoteType.journal),
      eq(noteTable.createdAt, date),
    ),
  });
}

export async function createEmptyJournal(date: Date) {
  return db.insert(noteTable).values(createJournalEntry(date));
}

export async function updateJournal(id: number, content: string) {
  return db.update(noteTable).set({ content }).where(eq(noteTable.id, id));
}

export async function getJournalsCount() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(noteTable)
    .where(eq(noteTable.type, NoteType.journal));
  return Number(result[0].count);
}

export async function getJournals(limit = 10, offset = 0) {
  return db.query.noteTable.findMany({
    where: eq(noteTable.type, NoteType.journal),
    orderBy: desc(noteTable.createdAt),
    limit,
    offset,
  });
}

export async function getLatestJournal() {
  return db.query.noteTable.findFirst({
    where: eq(noteTable.type, NoteType.journal),
    orderBy: desc(noteTable.createdAt),
  });
}

export async function createMissingJournals(fromDate: Date, toDate: Date) {
  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(toDate);
  end.setHours(0, 0, 0, 0);

  const existingJournals = await db.query.noteTable.findMany({
    where: and(
      eq(noteTable.type, NoteType.journal),
      gte(noteTable.createdAt, start),
      lte(noteTable.createdAt, end),
    ),
  });

  const existingDates = new Set(
    existingJournals.map((j) => j.createdAt.toDateString()),
  );

  const journalsToCreate = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (!existingDates.has(d.toDateString())) {
      journalsToCreate.push(createJournalEntry(new Date(d)));
    }
  }

  if (journalsToCreate.length > 0) {
    return db.insert(noteTable).values(journalsToCreate);
  }
}

export async function ensureJournalExists() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestJournal = await getLatestJournal();
  if (!latestJournal) {
    await createEmptyJournal(today);
    return;
  }

  const latestDate = new Date(latestJournal.createdAt);
  latestDate.setHours(0, 0, 0, 0);

  if (latestDate < today) {
    await createMissingJournals(latestDate, today);
  }
}
