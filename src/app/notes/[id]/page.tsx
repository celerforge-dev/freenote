"use client";

import Editor from "@/components/editor";
import { db, Note, NoteType } from "@/lib/db";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const debouncedContent = useDebounce(content, 1000);

  const loadNote = useCallback(async () => {
    try {
      const result = await db.notes.get(parseInt(id));
      if (result) {
        setNote(result);
        setContent(result.content);
      }
    } catch (error) {
      console.error("Failed to load note:", error);
    }
  }, [id]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  useEffect(() => {
    const updateNote = async () => {
      if (!note || content === note.content) return;

      try {
        await db.notes.update(note.id, {
          content,
          updatedAt: new Date(),
        });
        setNote((prev) =>
          prev ? { ...prev, content, updatedAt: new Date() } : null,
        );
      } catch (error) {
        console.error("Failed to update note:", error);
      }
    };

    updateNote();
  }, [debouncedContent, note, content]);

  if (!note) {
    return <div>Loading...</div>;
  }

  const backUrl = note.type === NoteType.Journal ? "/journal" : "/knowledge";

  return (
    <div className="container mx-auto space-y-4 px-4 py-6">
      <div className="flex items-center gap-4">
        <Link
          href={backUrl}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to{" "}
          {note.type === NoteType.Journal ? "Journal" : "Knowledge Base"}
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div className="text-sm text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </div>

        <Editor markdown={content} onValueChange={setContent} />
      </div>
    </div>
  );
}
