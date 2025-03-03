"use client";

import { Messages } from "@/components/chat/messages";
import { ChatWithMessages, useChatStore } from "@/contexts/chat-store";
import { generateEmbedding } from "@/lib/ai/embedding";
import { generateChatTitle } from "@/lib/chat";
import { db } from "@/lib/db";
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";
import { ChatInput } from "./chat-input";

export function euclideanDistance(A: number[], B: number[]): number {
  return Math.sqrt(A.reduce((sum, a, i) => sum + Math.pow(a - B[i], 2), 0));
}

async function findSimilarContent(queryEmbedding: number[], limit = 4) {
  const BATCH_SIZE = 100;
  let offset = 0;
  let bestMatches: Array<{ content: string; distance: number }> = [];

  while (true) {
    const batch = await db.embeddings
      .offset(offset)
      .limit(BATCH_SIZE)
      .toArray();

    if (batch.length === 0) break;

    const distances = batch.map((doc) => ({
      content: doc.content,
      distance: euclideanDistance(queryEmbedding, doc.embedding),
    }));

    bestMatches = [...bestMatches, ...distances]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    offset += BATCH_SIZE;
  }

  return bestMatches;
}

interface ChatContainerProps {
  className?: string;
  containerClassName?: string;
  chat: ChatWithMessages;
}

export function ChatContainer({
  className,
  containerClassName,
  chat,
}: ChatContainerProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    status,
    stop,
    error,
    reload,
    isLoading,
  } = useChat({
    maxSteps: 3,
    initialMessages: chat.messages,
    id: chat.id,
    sendExtraMessageFields: true,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "retrieveNote") {
        const queryEmbedding = await generateEmbedding(
          (toolCall.args as { question: string }).question,
        );
        const embeddings = await findSimilarContent(queryEmbedding);
        return {
          relevantInformation: embeddings.map((e) => e.content).join("\n\n"),
          sourcesCount: embeddings.length,
        };
      }
    },
    onFinish: async (message) => {
      if (message.role === "assistant" && message.content) {
        await insertChatMessage({
          content: message.content,
          createdAt: new Date(),
          role: message.role as "assistant",
          chatId: chat.id,
        });
      }
    },
  });

  const { updateChat, insertChatMessage } = useChatStore();

  const handleSaveMessage = async () => {
    await insertChatMessage({
      content: input,
      createdAt: new Date(),
      role: "user",
      chatId: chat.id,
    });

    // If this is the first user message and the chat title is "New Chat", generate a title
    if (messages.length === 0 && chat.title === "New Chat") {
      try {
        const generatedTitle = generateChatTitle(input);
        await updateChat(chat.id, {
          title: generatedTitle,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Failed to generate chat title:", error);
      }
    }
  };

  const handleSubmitWithSave = async () => {
    if (input.trim()) {
      await handleSaveMessage();
      await handleChatSubmit({ preventDefault: () => {} });
    }
  };

  return (
    <div
      className={
        containerClassName ??
        "container flex h-[calc(100vh-64px)] max-w-3xl flex-col gap-4 py-6"
      }
    >
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          <Messages messages={messages as Message[]} isLoading={isLoading} />
        </div>
      </div>
      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}
      <div className="sticky bottom-6">
        <ChatInput
          className={className}
          input={input}
          disabled={status !== "ready"}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmitWithSave}
          onStop={
            status === "submitted" || status === "streaming" ? stop : undefined
          }
        />
      </div>
    </div>
  );
}
