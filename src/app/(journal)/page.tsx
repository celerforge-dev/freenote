"use client";

import {
  ensureJournalExists,
  getJournals,
  updateJournal,
} from "@/actions/journal";
import { Icons } from "@/components/icons";
import { Note } from "@/lib/db/schema";
import { useDebounce, useWindowScroll } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export default function Page() {
  const [journals, setJournals] = useState<Note[]>([]);
  const [{ y }, scrollTo] = useWindowScroll();
  const [page, setPage] = useState(0);
  const [pendingUpdates, setPendingUpdates] = useState<Record<number, string>>(
    {},
  );
  const debouncedUpdates = useDebounce(pendingUpdates, 1000);

  useEffect(() => {
    const loadJournals = async () => {
      await ensureJournalExists().then(async () => {
        const newJournals = await getJournals(10, 0);
        setJournals(newJournals);
      });
    };

    loadJournals();
  }, []);

  useEffect(() => {
    const isNearBottom =
      window.innerHeight + (y ?? 0) >=
      document.documentElement.scrollHeight - 100;

    if (isNearBottom) {
      getJournals(10, (page + 1) * 10).then((newJournals) => {
        if (newJournals.length > 0) {
          setJournals((prev) => [...prev, ...newJournals]);
          setPage((p) => p + 1);
        }
      });
    }
  }, [y, page]);

  useEffect(() => {
    if (Object.keys(debouncedUpdates).length > 0) {
      Object.entries(debouncedUpdates).forEach(([id, content]) => {
        updateJournal(Number(id), content);
      });
    }
  }, [debouncedUpdates]);

  const handleContentChange = (id: number, content: string) => {
    setPendingUpdates((prev) => ({ ...prev, [id]: content }));
  };

  return (
    <div className="flex flex-col divide-y">
      {journals.map((journal, index) => (
        <div
          key={journal.id}
          className={`flex flex-col px-4 pb-6 ${
            index === 0 ? "h-[calc(100vh-128px)]" : "min-h-72"
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

      {y !== undefined && (y ?? 0) > 500 && (
        <button
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background"
        >
          <Icons.arrowUp size={18} />
        </button>
      )}
    </div>
  );
}
