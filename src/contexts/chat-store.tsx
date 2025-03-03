"use client";

import { Chat, ChatMessage, db } from "@/lib/db";
import { generateId } from "ai";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ChatWithMessages = Chat & {
  messages: ChatMessage[];
};

interface ChatStore {
  chats: Chat[];
  isLoading: boolean;
  createChat: () => Promise<string>;
  updateChat: (chatId: string, update: Partial<Chat>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  getChat: (id: string) => Promise<ChatWithMessages | null>;
  insertChatMessage: (message: Omit<ChatMessage, "id">) => Promise<void>;
}

const ChatStoreContext = createContext<ChatStore | undefined>(undefined);

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChats = useCallback(async () => {
    try {
      const chatList = await db.chats.orderBy("updatedAt").reverse().toArray();
      setChats(chatList);
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const createChat = useCallback(async () => {
    const id = generateId();
    await db.chats.add({
      id,
      title: "New Chat",
      createdAt: new Date(),
      updatedAt: null,
    });
    loadChats();
    return id;
  }, [loadChats]);

  const updateChat = useCallback(
    async (chatId: string, update: Partial<Chat>) => {
      await db.chats.update(chatId, update);
      loadChats();
    },
    [loadChats],
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      await db.chats.delete(chatId);
      loadChats();
    },
    [loadChats],
  );

  const getChat = useCallback(async (id: string) => {
    const chat = await db.chats.get(id);
    if (!chat) {
      return null;
    }
    const messages = await db.chatMessages.where("chatId").equals(id).toArray();
    return { ...chat, messages };
  }, []);

  const insertChatMessage = useCallback(
    async (message: Omit<ChatMessage, "id">) => {
      await db.chatMessages.add(message);
    },
    [],
  );

  return (
    <ChatStoreContext.Provider
      value={{
        chats,
        isLoading,
        createChat,
        updateChat,
        deleteChat,
        getChat,
        insertChatMessage,
      }}
    >
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore() {
  const context = useContext(ChatStoreContext);
  if (context === undefined) {
    throw new Error("useChatStore must be used within a ChatStoreProvider");
  }
  return context;
}
