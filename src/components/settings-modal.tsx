"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { useSettings } from "@/context/settings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { settings, updateSettings } = useSettings();
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [activeTab, setActiveTab] = useState<SettingsTab>("provider");

  useEffect(() => {
    if (settings) {
      setBaseUrl(settings.baseUrl || "");
      setApiKey(settings.apiKey || "");
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      ...settings,
      baseUrl,
      apiKey,
    });
    onClose();
    router.refresh();
    toast.success("Settings saved.", {
      description: "Your settings have been successfully updated.",
    });
  };

  const handleSync = () => {
    toast.info("Syncing embeddings...", {
      description: "This process may take a few minutes.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
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
                    <Button variant="secondary" onClick={handleSync}>
                      <Icons.refreshCw className="mr-2 h-4 w-4" />
                      Synchronize Data
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
