import { generateEmbeddings } from "@/lib/ai/embedding";
import { db } from "@/lib/db";
import { SETTINGS } from "@/lib/settings";
import { useDebounce } from "@uidotdev/usehooks";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";

export function useJournalUpdates() {
  const [pendingUpdates, setPendingUpdates] = useState<Record<number, string>>(
    {},
  );
  const cookies = useCookies();
  const [autoUpdate] = useState(
    cookies.get(SETTINGS.ai.embeddings.autoUpdate) !== "false" &&
      cookies.get(SETTINGS.ai.provider.apiKey) !== undefined,
  );
  const debouncedUpdates = useDebounce(pendingUpdates, 1000);

  useEffect(() => {
    const updateEntries = async () => {
      const updates = Object.entries(debouncedUpdates);
      if (updates.length === 0) return;

      try {
        await Promise.all(
          updates.map(async ([id, content]) => {
            const updates: {
              content: string;
              updatedAt: Date;
              embeddingUpdatedAt?: Date;
            } = {
              content,
              updatedAt: new Date(),
            };
            if (autoUpdate) {
              db.embeddings.where("noteId").equals(Number(id)).delete();
              const title = await db.notes
                .get(Number(id))
                .then((note) => note?.title);
              const embedding = await generateEmbeddings(content, title);
              await db.embeddings.bulkAdd(
                embedding.map((embedding) => ({
                  noteId: Number(id),
                  content: embedding.content,
                  embedding: embedding.embedding,
                })),
              );
              updates["embeddingUpdatedAt"] = updates.updatedAt;
            }
            db.notes.update(Number(id), updates);
          }),
        );
      } catch (err) {
        console.error("Failed to update journals:", err);
      }
    };

    updateEntries();
  }, [debouncedUpdates, autoUpdate]);

  return {
    handleContentChange: (id: number, content: string) => {
      setPendingUpdates((prev) => ({ ...prev, [id]: content }));
    },
  };
}
