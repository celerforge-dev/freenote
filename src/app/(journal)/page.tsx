"use client";

import {
  ensureJournalExists,
  getJournals,
  getJournalsCount,
  updateJournal,
} from "@/actions/journal";
import { Icons } from "@/components/icons";
import { Note } from "@/lib/db/schema";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex justify-center py-6 text-secondary-foreground">
      <Icons.loader className={`h-7 w-7 animate-spin ${className ?? ""}`} />
    </div>
  );
}

export default function Page() {
  const [journals, setJournals] = useState<Note[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingUpdates, setPendingUpdates] = useState<Record<number, string>>(
    {},
  );
  const debouncedUpdates = useDebounce(pendingUpdates, 1000);
  const [page, setPage] = useState(0);
  const { ref, inView } = useInView();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsInitialLoading(true);
        await ensureJournalExists();
        const [journals, count] = await Promise.all([
          getJournals(10, 0),
          getJournalsCount(),
        ]);
        setJournals(journals);
        setTotalCount(count);
        setPage(1);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (inView && page > 0 && !isLoadingMore && journals.length < totalCount) {
      setIsLoadingMore(true);
      getJournals(10, page * 10).then((newJournals) => {
        setJournals((prev) => [...prev, ...newJournals]);
        setPage((p) => p + 1);
        setIsLoadingMore(false);
      });
    }
  }, [inView, page, isLoadingMore, journals.length, totalCount]);

  useEffect(() => {
    if (Object.keys(debouncedUpdates).length > 0) {
      Object.entries(debouncedUpdates).forEach(([id, content]) => {
        updateJournal(Number(id), content);
      });
    }
  }, [debouncedUpdates]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContentChange = (id: number, content: string) => {
    setPendingUpdates((prev) => ({ ...prev, [id]: content }));
  };

  if (isInitialLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {journals.map((journal, index) => (
        <div
          key={journal.id}
          className={`flex flex-col px-4 pb-6 ${
            index === 0 ? "min-h-[calc(100vh-128px)]" : "min-h-72"
          }`}
        >
          <div className="flex h-16 items-center justify-between">
            <h2 className="text-xl font-semibold">{journal.title}</h2>
          </div>
          <textarea
            defaultValue={journal.content ?? ""}
            className="w-full flex-1 resize-none bg-transparent focus:outline-none"
            placeholder="Start writing..."
            onChange={(e) => handleContentChange(journal.id, e.target.value)}
          />
        </div>
      ))}

      <div ref={ref} className="h-10 w-full">
        {isLoadingMore && <LoadingSpinner />}
        {journals.length >= totalCount && journals.length > 0 && (
          <div className="flex justify-center py-6 text-secondary-foreground">
            No more entries
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background"
        >
          <Icons.arrowUp size={18} />
        </button>
      )}
    </div>
  );
}
