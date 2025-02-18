import { Note } from "@/lib/db/schema/note";
import Dexie, { EntityTable } from "dexie";

class FreeNoteDB extends Dexie {
  notes!: EntityTable<Note, "id">;

  constructor() {
    super("freenote");
    this.version(1).stores({
      notes: "++id, title, type, createdAt, updatedAt, embeddingUpdatedAt",
    });
  }
}

export const db = new FreeNoteDB();
export * from "@/lib/db/schema/note";
