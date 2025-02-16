import { db, Note, NoteType } from "@/lib/db";
import { useCallback, useState } from "react";

function createJournalEntry(date: Date): Omit<Note, "id"> {
  return {
    type: NoteType.Journal,
    title: date.toLocaleDateString(),
    content: "",
    embedding: [],
    createdAt: date,
    updatedAt: null,
    embeddingUpdatedAt: null,
  };
}

async function createEmptyJournal(date: Date) {
  return db.notes.add(createJournalEntry(date));
}

async function createMissingJournals(fromDate: Date, toDate: Date) {
  const existingJournals = await db.notes
    .where("type")
    .equals(NoteType.Journal)
    .filter((note) => note.createdAt >= fromDate && note.createdAt <= toDate)
    .toArray();

  const existingDates = new Set(
    existingJournals.map((j) => j.createdAt.toDateString()),
  );

  const journalsToCreate = [];
  for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
    if (!existingDates.has(d.toDateString())) {
      journalsToCreate.push(createJournalEntry(new Date(d)));
    }
  }

  if (journalsToCreate.length > 0) {
    await db.notes.bulkAdd(journalsToCreate);
  }
}

export function useJournals() {
  const [journals, setJournals] = useState<Note[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState({
    initial: true,
    more: false,
  });
  const [error, setError] = useState<string | null>(null);

  const ensureJournalExists = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestJournal = await db.notes
      .where("type")
      .equals(NoteType.Journal)
      .reverse()
      .first();

    if (!latestJournal) {
      await createEmptyJournal(today);
      return;
    }

    const latestDate = new Date(latestJournal.createdAt);
    latestDate.setHours(0, 0, 0, 0);

    if (latestDate < today) {
      await createMissingJournals(latestDate, today);
    }
  };

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading((prev) => ({ ...prev, initial: true }));
      await ensureJournalExists();

      const [journalData, count] = await Promise.all([
        db.notes
          .where("type")
          .equals(NoteType.Journal)
          .reverse()
          .offset(0)
          .limit(10)
          .toArray(),
        db.notes.where("type").equals(NoteType.Journal).count(),
      ]);

      setJournals(journalData);
      setTotalCount(count);
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load journals.");
    } finally {
      setIsLoading((prev) => ({ ...prev, initial: false }));
    }
  }, []);

  const loadMoreJournals = useCallback(async () => {
    if (isLoading.more || journals.length >= totalCount) return;

    try {
      setIsLoading((prev) => ({ ...prev, more: true }));
      const newJournals = await db.notes
        .where("type")
        .equals(NoteType.Journal)
        .reverse()
        .offset(page * 10)
        .limit(10)
        .toArray();

      setJournals((prev) => [...prev, ...newJournals]);
      setPage((p) => p + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more journals",
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, more: false }));
    }
  }, [isLoading.more, journals.length, totalCount, page]);

  return {
    journals,
    totalCount,
    isLoading,
    error,
    loadInitialData,
    loadMoreJournals,
  };
}
