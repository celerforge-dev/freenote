"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { ChatContainerSkeleton } from "@/components/chat/skeletons";
import { ChatWithMessages, getChat } from "@/lib/chat";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [chat, setChat] = useState<ChatWithMessages | null>(null);

  useEffect(() => {
    async function fetchChat() {
      const chat = await getChat(id);
      if (!chat) {
        return <div>Chat not found.</div>;
      }
      setChat(chat);
    }
    fetchChat();
  }, [id]);

  if (!chat) {
    return <ChatContainerSkeleton />;
  }

  return <ChatContainer chat={chat} />;
}
