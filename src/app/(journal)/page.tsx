"use client";

import {
  createEmptyJournal,
  createMissingJournals,
  getJournals,
  getLatestJournal,
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
  const [lastMidnight, setLastMidnight] = useState<Date>(new Date());
  const [pendingUpdates, setPendingUpdates] = useState<Record<number, string>>(
    {},
  );
  const debouncedUpdates = useDebounce(pendingUpdates, 1000);

  useEffect(() => {
    getJournals(10, page * 10).then((newJournals) => {
      setJournals((prev) => {
        const existingIds = new Set(prev.map((journal) => journal.id));
        const uniqueNewJournals = newJournals.filter(
          (journal) => !existingIds.has(journal.id),
        );
        return [...prev, ...uniqueNewJournals];
      });
    });
  }, [page]);

  useEffect(() => {
    const init = async () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const latestJournal = await getLatestJournal();

      if (!latestJournal) {
        await createEmptyJournal(now);
      } else {
        const latestDate = new Date(latestJournal.createdAt);
        if (latestDate.toDateString() !== now.toDateString()) {
          await createMissingJournals(latestDate, now);
        }
      }

      const newJournals = await getJournals(10, 0);
      setJournals(newJournals);
    };

    init();
  }, []);

  useEffect(() => {
    const checkNewDay = () => {
      const now = new Date();
      if (now.getDate() !== lastMidnight.getDate()) {
        createEmptyJournal(now).then(() => {
          setPage(0);
          setJournals([]);
        });
        setLastMidnight(now);
      }
    };

    const interval = setInterval(checkNewDay, 1000 * 60);
    return () => clearInterval(interval);
  }, [lastMidnight]);

  useEffect(() => {
    const isNearBottom =
      window.innerHeight + (y ?? 0) >=
      document.documentElement.scrollHeight - 100;

    if (isNearBottom) {
      setPage((p) => p + 1);
    }
  }, [y]);

  useEffect(() => {
    const updateJournals = async () => {
      const updates = Object.entries(debouncedUpdates);
      for (const [id, content] of updates) {
        await updateJournal(Number(id), content);
      }
    };

    if (Object.keys(debouncedUpdates).length > 0) {
      updateJournals();
    }
  }, [debouncedUpdates]);

  const handleContentChange = (id: number, content: string) => {
    setPendingUpdates((prev) => ({
      ...prev,
      [id]: content,
    }));
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

      <div>
        {y !== undefined && (y ?? 0) > 500 && (
          <button
            onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background"
          >
            <Icons.arrowUp size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
