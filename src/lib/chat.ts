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

/**
 * Generates a simple title for a chat based on the first message
 * @param message The first user message in the chat
 * @returns A generated title for the chat
 */
export function generateChatTitle(message: string): string {
  if (!message || message.trim().length === 0) {
    return "New Chat";
  }

  try {
    // Extract the first few words as the title
    const words = message.trim().split(/\s+/);

    // If message is short, use the entire message
    if (words.length <= 5) {
      return message.length <= 30 ? message : message.substring(0, 27) + "...";
    }

    // Otherwise take the first 5 words
    const title = words.slice(0, 5).join(" ");
    return title.length <= 30 ? title : title.substring(0, 27) + "...";
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Chat"; // Default title if generation fails
  }
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
