"use client";

import Editor from "@/components/editor";
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
import { Button } from "@/components/ui/button";
import { db, Note, NoteType } from "@/lib/db";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
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

  const handleDelete = async () => {
    if (!note) return;

    try {
      await db.notes.delete(note.id);
      toast.success("Note deleted.");
      router.push(note.type === NoteType.Journal ? "/journal" : "/knowledge");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete the note. Please try again.");
    }
  };

  if (!note) {
    return <div>Loading...</div>;
  }

  const backUrl = note.type === NoteType.Journal ? "/journal" : "/knowledge";

  return (
    <div className="container mx-auto space-y-4 px-4 py-6">
      <div className="flex items-center justify-between pb-4">
        <Link
          href={backUrl}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to{" "}
          {note.type === NoteType.Journal ? "Journal" : "Knowledge Base"}
        </Link>
        {note.type === NoteType.Knowledge && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="h-8">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{note.title}</h1>
          <div className="text-sm text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </div>

        <Editor markdown={content} onValueChange={setContent} />
      </div>
    </div>
  );
}
