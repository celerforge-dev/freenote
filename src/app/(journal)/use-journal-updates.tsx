import { db } from "@/lib/db";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export function useJournalUpdates() {
  const [pendingUpdates, setPendingUpdates] = useState<Record<number, string>>(
    {},
  );
  const debouncedUpdates = useDebounce(pendingUpdates, 1000);

  useEffect(() => {
    const updateEntries = async () => {
      const updates = Object.entries(debouncedUpdates);
      if (updates.length === 0) return;

      try {
        await Promise.all(
          updates.map(([id, content]) =>
            db.notes.update(Number(id), { content, updatedAt: new Date() }),
          ),
        );
      } catch (err) {
        console.error("Failed to update journals:", err);
      }
    };

    updateEntries();
  }, [debouncedUpdates]);

  return {
    handleContentChange: (id: number, content: string) => {
      setPendingUpdates((prev) => ({ ...prev, [id]: content }));
    },
  };
}
