"use client";

import { EmbeddingsSettings } from "@/components/settings/embeddings-settings";
import { ProviderSettings } from "@/components/settings/provider-settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [autoUpdateEmbeddings, setAutoUpdateEmbeddings] = useState(
    cookies.get(SETTINGS.ai.embeddings.autoUpdate) !== "false",
  );
  const [activeTab, setActiveTab] = useState<SettingsTab>("provider");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    cookies.set(SETTINGS.ai.provider.baseUrl, baseUrl);
    cookies.set(SETTINGS.ai.provider.apiKey, apiKey);
    cookies.set(
      SETTINGS.ai.embeddings.autoUpdate,
      autoUpdateEmbeddings.toString(),
    );
    onClose();
    router.refresh();

    // Dispatch custom event to notify that settings have been updated
    window.dispatchEvent(new Event("settings-updated"));

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
            <div className="mb-4 flex border-b px-4 pt-4 md:hidden">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "provider"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("provider")}
              >
                Provider
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "embeddings"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("embeddings")}
              >
                Embeddings
              </button>
            </div>
            <div className="relative flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activeTab === "provider" && (
                <ProviderSettings
                  baseUrl={baseUrl}
                  apiKey={apiKey}
                  onBaseUrlChange={setBaseUrl}
                  onApiKeyChange={setApiKey}
                  onSave={handleSave}
                  onCancel={onClose}
                />
              )}
              {activeTab === "embeddings" && (
                <EmbeddingsSettings
                  autoUpdate={autoUpdateEmbeddings}
                  onAutoUpdateChange={setAutoUpdateEmbeddings}
                  onSync={handleSync}
                  isSyncing={isSyncing}
                />
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
