import { objEnum } from "@/lib/utils";
import {
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const NoteTypeEnum = pgEnum("note_type", ["journal", "knowledge"]);

export const note = pgTable(
  "note",
  {
    id: serial("id").primaryKey(),
    type: NoteTypeEnum("type").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export const NoteType = objEnum(["journal", "knowledge"]);
export type Note = typeof note.$inferSelect;
export type InsertNote = typeof note.$inferInsert;
