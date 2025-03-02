"use client";

import { Messages } from "@/components/chat/messages";
import { generateEmbedding } from "@/lib/ai/embedding";
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
}

export function ChatContainer({
  className,
  containerClassName,
}: ChatContainerProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
    isLoading,
  } = useChat({
    maxSteps: 3,
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
  });

  return (
    <div
      className={
        containerClassName ??
        "container flex h-[calc(100vh-64px)] max-w-3xl flex-col gap-4 py-6"
      }
    >
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {/* {messages.map((m: Message) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">{m.role}</div>
                <p>
                  {m.content.length > 0 ? (
                    m.content
                  ) : (
                    <span className="font-light italic">
                      {"calling tool: " + m?.toolInvocations?.[0].toolName}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))} */}
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
          handleSubmit={handleSubmit}
          onStop={
            status === "submitted" || status === "streaming" ? stop : undefined
          }
        />
      </div>
    </div>
  );
}
