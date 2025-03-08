"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { generateEmbeddings } from "@/lib/ai/embedding";
import { db } from "@/lib/db";
import { SETTINGS } from "@/lib/settings";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SettingsTab = "provider" | "embeddings";

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const cookies = useCookies();
  const [baseUrl, setBaseUrl] = useState(
    cookies.get(SETTINGS.ai.provider.baseUrl) ?? "",
  );
  const [apiKey, setApiKey] = useState(
    cookies.get(SETTINGS.ai.provider.apiKey) ?? "",
  );
  const [activeTab, setActiveTab] = useState<SettingsTab>("provider");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    cookies.set(SETTINGS.ai.provider.baseUrl, baseUrl);
    cookies.set(SETTINGS.ai.provider.apiKey, apiKey);
    onClose();
    router.refresh();
    toast.success("Settings saved.", {
      description: "Your settings have been successfully updated.",
    });
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      // Get all notes that need embedding updates
      const notesToUpdate = await db.notes
        .filter((note) => {
          if (note.content.length === 0) return false;
          if (!note.embeddingUpdatedAt) return true;
          if (!note.updatedAt) return false;
          return note.updatedAt > note.embeddingUpdatedAt;
        })
        .toArray();

      if (notesToUpdate.length === 0) {
        toast.info("No updates needed", {
          description: "All notes are already synchronized.",
        });
        return;
      }

      // Process each note that needs updating
      for (const note of notesToUpdate) {
        const embedding = await generateEmbeddings(note.content, note.title);
        await db.transaction("rw", db.notes, db.embeddings, async () => {
          await db.embeddings.where("noteId").equals(note.id).delete();
          await db.embeddings.bulkAdd(
            embedding.map((embedding) => ({
              noteId: note.id,
              content: embedding.content,
              embedding: embedding.embedding,
            })),
          );
          await db.notes.update(note.id, {
            embeddingUpdatedAt: new Date(),
          });
        });
      }

      toast.success("Embeddings synchronized", {
        description: `Successfully updated ${notesToUpdate.length} notes.`,
      });

      router.refresh();
    } catch (error) {
      console.error("Error syncing embeddings:", error);
      toast.error("Sync failed", {
        description: "Failed to synchronize embeddings. Please try again.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Settings</DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>AI</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "provider"}
                        onClick={() => setActiveTab("provider")}
                      >
                        <span>Provider</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "embeddings"}
                        onClick={() => setActiveTab("embeddings")}
                      >
                        <span>Embeddings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <div className="relative flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activeTab === "provider" && (
                <div className="space-y-4 py-4">
                  <h3 className="text-lg font-medium">LLM Provider</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Configure your OpenAI API settings to connect with the AI
                    services.
                  </p>
                  <div className="grid gap-2">
                    <Label htmlFor="baseUrl">API Base URL</Label>
                    <Input
                      id="baseUrl"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://api.openai.com/v1"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Default: https://api.openai.com/v1
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your OpenAI API key"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your API key is stored locally and never shared.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      You can get your API key from{" "}
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        OpenAI&apos;s API Keys page
                      </a>{" "}
                      after creating an account.
                    </p>
                  </div>
                  <div className="fixed bottom-0 right-0 flex items-center gap-4 p-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save changes</Button>
                  </div>
                </div>
              )}
              {activeTab === "embeddings" && (
                <div className="space-y-4 py-4">
                  <h3 className="text-lg font-medium">Embeddings</h3>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Manage your AI embeddings to ensure your model has access to
                    the most up-to-date content. Regular synchronization
                    improves response accuracy and relevance.
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSync} disabled={isSyncing}>
                      <Icons.refreshCw
                        className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                      />
                      {isSyncing ? "Synchronizing..." : "Synchronize Data"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
