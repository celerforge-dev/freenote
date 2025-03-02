import { Chat } from "@/lib/db/schema/chat";
import { ChatMessage } from "@/lib/db/schema/chat-message";
import { Embedding } from "@/lib/db/schema/embedding";
import { Note } from "@/lib/db/schema/note";
import Dexie, { EntityTable } from "dexie";

class FreeNoteDB extends Dexie {
  notes!: EntityTable<Note, "id">;
  embeddings!: EntityTable<Embedding, "id">;
  chats!: EntityTable<Chat, "id">;
  chatMessages!: EntityTable<ChatMessage, "id">;

  constructor() {
    super("freenote");
    this.version(1).stores({
      notes: "++id, title, type, createdAt, updatedAt, embeddingUpdatedAt",
      embeddings: "++id, noteId, content, embedding",
      chats: "++id, title, updatedAt, createdAt",
      chatMessages: "++id, chatId",
    });
  }
}

export const db = new FreeNoteDB();
export * from "@/lib/db/schema/chat";
export * from "@/lib/db/schema/chat-message";
export * from "@/lib/db/schema/embedding";
export * from "@/lib/db/schema/note";
