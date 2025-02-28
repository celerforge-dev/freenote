import { Embedding } from "@/lib/db/schema/embedding";
import { Note } from "@/lib/db/schema/note";
import Dexie, { EntityTable } from "dexie";

class FreeNoteDB extends Dexie {
  notes!: EntityTable<Note, "id">;
  embeddings!: EntityTable<Embedding, "id">;

  constructor() {
    super("freenote");
    this.version(1).stores({
      notes: "++id, title, type, createdAt, updatedAt, embeddingUpdatedAt",
      embeddings: "++id, noteId, content, embedding",
    });
  }
}

export const db = new FreeNoteDB();
export * from "@/lib/db/schema/note";
