"use client";

import { NewChatSkeleton } from "@/components/chat/skeletons";
import { useChatStore } from "@/contexts/chat-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { createChat } = useChatStore();

  useEffect(() => {
    async function create() {
      const id = await createChat();
      router.push(`/chat/${id}`);
    }

    create();
  }, [router, createChat]);

  return <NewChatSkeleton />;
}
