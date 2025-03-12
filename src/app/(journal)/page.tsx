"use client";

import { useJournalUpdates } from "@/app/(journal)/use-journal-updates";
import { useJournals } from "@/app/(journal)/use-journals";
import Editor from "@/components/editor";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex justify-center py-6 text-secondary-foreground">
      <Icons.loader className={`h-7 w-7 animate-spin ${className ?? ""}`} />
    </div>
  );
}

export default function Page() {
  const {
    journals,
    totalCount,
    isLoading,
    error,
    loadInitialData,
    loadMoreJournals,
  } = useJournals();
  const { handleContentChange } = useJournalUpdates();
  const { ref, inView } = useInView();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (inView) {
      loadMoreJournals();
    }
  }, [inView, loadMoreJournals]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading.initial) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {journals.map((journal, index) => (
        <div
          key={journal.id}
          className={`flex flex-col px-4 pb-6 ${
            index === 0 ? "min-h-[calc(100vh-128px)]" : "min-h-72"
          }`}
        >
          <div className="flex h-16 items-center justify-between">
            <h2 className="text-xl font-semibold">{journal.title}</h2>
          </div>
          <Editor
            markdown={journal.content ?? ""}
            placeholder="Start typing..."
            onValueChange={(value) => handleContentChange(journal.id, value)}
            contentEditableClassName={
              index === 0 ? "min-h-[calc(100vh-192px)]" : "min-h-56"
            }
          />
        </div>
      ))}

      <div ref={ref} className="h-10 w-full">
        {isLoading.more && <LoadingSpinner />}
        {journals.length >= totalCount && journals.length > 0 && (
          <div className="flex justify-center py-6 text-secondary-foreground">
            No more journals.
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background"
        >
          <Icons.arrowUp size={18} />
        </button>
      )}
    </div>
  );
}
