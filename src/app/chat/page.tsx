"use client";

import { createChat } from "@/lib/chat";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function create() {
      const id = await createChat();
      router.push(`/chat/${id}`);
    }

    create();
  }, [router]);

  return <div>Creating new chat...</div>;
}
