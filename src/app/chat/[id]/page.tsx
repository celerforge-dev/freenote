"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { ChatContainerSkeleton } from "@/components/chat/skeletons";
import { ChatWithMessages, getChat } from "@/lib/chat";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [chat, setChat] = useState<ChatWithMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchChat() {
      setLoading(true);
      setNotFound(false);

      const chat = await getChat(id);

      if (!chat) {
        setNotFound(true);
      } else {
        setChat(chat);
      }

      setLoading(false);
    }

    fetchChat();
  }, [id]);

  if (notFound) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Chat not found</h2>
          <p className="mt-2 text-muted-foreground">
            The chat you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <ChatContainerSkeleton />;
  }

  return <ChatContainer chat={chat!} />;
}
