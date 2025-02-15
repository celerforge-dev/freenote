import { updateJournal } from "@/actions/journal";
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
          updates.map(([id, content]) => updateJournal(Number(id), content)),
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
