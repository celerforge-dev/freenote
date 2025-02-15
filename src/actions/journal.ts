"use server";

import { db } from "@/lib/db";
import { note, NoteType } from "@/lib/db/schema/note";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export async function createEmptyJournal(date: Date) {
  return db.insert(note).values({
    type: NoteType.journal,
    title: date.toLocaleDateString(),
    content: "",
    embedding: new Array(1536).fill(0),
    createdAt: date,
    updatedAt: date,
  });
}

export async function getJournal(date: Date) {
  return db.query.note.findFirst({
    where: and(eq(note.type, NoteType.journal), eq(note.createdAt, date)),
  });
}

export async function getJournals(limit = 10, offset = 0) {
  return db.query.note.findMany({
    where: eq(note.type, NoteType.journal),
    orderBy: desc(note.createdAt),
    limit,
    offset,
  });
}

export async function getLatestJournal() {
  return db.query.note.findFirst({
    where: eq(note.type, NoteType.journal),
    orderBy: desc(note.createdAt),
  });
}

export async function createMissingJournals(fromDate: Date, toDate: Date) {
  const start = new Date(fromDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(toDate);
  end.setHours(0, 0, 0, 0);

  const existingJournals = await db.query.note.findMany({
    where: and(
      eq(note.type, NoteType.journal),
      gte(note.createdAt, start),
      lte(note.createdAt, end),
    ),
  });

  const existingDates = new Set(
    existingJournals.map((j) => j.createdAt.toDateString()),
  );

  const promises = [];
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    if (!existingDates.has(d.toDateString())) {
      promises.push(createEmptyJournal(new Date(d)));
    }
  }

  return Promise.all(promises);
}

export async function updateJournal(id: number, content: string) {
  return db.update(note).set({ content }).where(eq(note.id, id));
}
