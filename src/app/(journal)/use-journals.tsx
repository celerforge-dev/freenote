import {
  ensureJournalExists,
  getJournals,
  getJournalsCount,
} from "@/actions/journal";
import { Note } from "@/lib/db/schema";
import { useCallback, useState } from "react";

export function useJournals() {
  const [journals, setJournals] = useState<Note[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState({
    initial: true,
    more: false,
  });
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading((prev) => ({ ...prev, initial: true }));
      await ensureJournalExists();
      const [journalData, count] = await Promise.all([
        getJournals(10, 0),
        getJournalsCount(),
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
      const newJournals = await getJournals(10, page * 10);
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
