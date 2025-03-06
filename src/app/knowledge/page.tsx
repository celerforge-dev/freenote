"use client";

import { KnowledgeDialog } from "@/app/knowledge/knowledge-dialog";
import { Input } from "@/components/ui/input";
import { db, Note, NoteType } from "@/lib/db";
import { Clock, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function KnowledgePage() {
  const [items, setItems] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const result = await db.notes
        .where("type")
        .equals(NoteType.Knowledge)
        .reverse()
        .toArray();
      setItems(result);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await db.notes
        .where("type")
        .equals(NoteType.Knowledge)
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()),
        )
        .toArray();
      setItems(results);
    } else {
      loadItems();
    }
  };

  const handleCreate = async (
    data: Omit<Note, "id" | "createdAt" | "updatedAt" | "embeddingUpdatedAt">,
  ) => {
    const now = new Date();
    await db.notes.add({
      ...data,
      type: NoteType.Knowledge,
      createdAt: now,
      updatedAt: null,
      embeddingUpdatedAt: null,
    });
    loadItems();
  };

  return (
    <div className="container mx-auto space-y-4 px-4 py-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <KnowledgeDialog onSubmit={handleCreate} />
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/notes/${item.id}`}
            className="cursor-pointer rounded-lg border px-4 py-2 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
