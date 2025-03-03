"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function ChatMessageSkeleton({
  className,
  isUser = false,
}: SkeletonProps & { isUser?: boolean }) {
  if (isUser) {
    return (
      <div className={cn("flex items-start justify-end gap-3", className)}>
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="ml-auto h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="w-full max-w-md space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

export function ChatInputSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative", className)}>
      <Skeleton className="h-[98px] w-full rounded-lg" />
      <Skeleton className="absolute bottom-2 right-2 h-8 w-8 rounded-full" />
    </div>
  );
}

export function ChatContainerSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "container flex h-[calc(100vh-4rem)] max-w-3xl flex-col space-y-4 py-6",
        className,
      )}
    >
      <div className="flex-1 space-y-4 overflow-auto py-4">
        <ChatMessageSkeleton />
        <ChatMessageSkeleton isUser />
        <ChatMessageSkeleton />
      </div>

      <ChatInputSkeleton />
    </div>
  );
}

export function NewChatSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "container flex h-[70vh] max-w-3xl flex-col items-center justify-center space-y-4 px-4",
        className,
      )}
    >
      <div className="w-full max-w-md space-y-2">
        <Skeleton className="mx-auto h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <p className="animate-pulse text-sm text-muted-foreground">
        Creating new chat...
      </p>
    </div>
  );
}
