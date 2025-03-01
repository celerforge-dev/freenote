"use client";

import { ChatInput } from "@/app/chat/chat-input";
import { useChat } from "@ai-sdk/react";

interface Message {
  id: string;
  role: string;
  content: string;
  toolInvocations?: Array<{ toolName: string }>;
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
  } = useChat({ maxSteps: 3 });

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
