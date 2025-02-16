import Dexie, { EntityTable } from "dexie";

export enum NoteType {
  Journal = "journal",
  Knowledge = "knowledge",
}

export type Note = {
  id: number;
  title: string;
  type: NoteType;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  embedding: number[];
  embeddingUpdatedAt: Date | null;
};

export const db = new Dexie("freenote") as Dexie & {
  notes: EntityTable<Note, "id">;
};
db.version(1).stores({
  notes: "++id, title, type, createdAt, updatedAt, embeddingUpdatedAt",
});
