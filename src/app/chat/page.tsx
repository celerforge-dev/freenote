"use client";

import { ChatInput } from "@/app/chat/chat-input";
import { generateEmbedding } from "@/lib/ai/embedding";
import { db } from "@/lib/db";
import { useChat } from "@ai-sdk/react";

interface Message {
  id: string;
  role: string;
  content: string;
  toolInvocations?: Array<{ toolName: string }>;
}

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

export default function Page() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    maxSteps: 3,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "getInformation") {
        const queryEmbedding = await generateEmbedding(
          (toolCall.args as { question: string }).question,
        );
        const embeddings = await findSimilarContent(queryEmbedding);
        return embeddings;
      }
    },
  });

  return (
    <div className="container flex h-[calc(100vh-64px)] max-w-3xl flex-col gap-4 py-6">
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {messages.map((m: Message) => (
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
          ))}
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
