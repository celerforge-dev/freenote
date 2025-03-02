import { Chat, ChatMessage, db } from "@/lib/db";
import { generateId } from "ai";

export type ChatWithMessages = Chat & {
  messages: ChatMessage[];
};

export async function createChat(): Promise<string> {
  const id = generateId();
  await db.chats.add({
    id,
    title: "New Chat",
    createdAt: new Date(),
    updatedAt: null,
  });
  return id;
}

export async function getChat(id: string): Promise<ChatWithMessages | null> {
  const chat = await db.chats.get(id);
  if (!chat) {
    return null;
  }
  const messages = await db.chatMessages.where("chatId").equals(id).toArray();
  return { ...chat, messages };
}

export async function updateChat(chatId: string, update: Partial<Chat>) {
  await db.chats.update(chatId, update);
}

export async function deleteChat(chatId: string) {
  await db.chats.delete(chatId);
}

export async function insertChatMessage(message: Omit<ChatMessage, "id">) {
  await db.chatMessages.add({
    ...message,
  });
}
