"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { ChatContainerSkeleton } from "@/components/chat/skeletons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ChatWithMessages, useChatStore } from "@/contexts/chat-store";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [chat, setChat] = useState<ChatWithMessages | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { getChat, deleteChat } = useChatStore();
  const router = useRouter();

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
  }, [id, getChat]);

  const handleDelete = async () => {
    await deleteChat(id);
    router.push("/");
  };

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

  return (
    <div className="relative">
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-full w-full">
            <ChatContainer chat={chat!} />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <AlertDialogTrigger className="w-full text-left text-destructive">
                Delete Chat
              </AlertDialogTrigger>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              chat and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
