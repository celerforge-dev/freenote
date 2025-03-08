"use client";

import { NewChatSkeleton } from "@/components/chat/skeletons";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/contexts/chat-store";
import { SETTINGS } from "@/lib/settings";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Custom event name for settings updates
const SETTINGS_UPDATED_EVENT = "settings-updated";

export default function Page() {
  const router = useRouter();
  const { createChat } = useChatStore();
  const cookies = useCookies();
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // Check if API is configured
  const checkApiConfiguration = useCallback(() => {
    const baseUrl = cookies.get(SETTINGS.ai.provider.baseUrl);
    const apiKey = cookies.get(SETTINGS.ai.provider.apiKey);
    return !!baseUrl && !!apiKey;
  }, [cookies]);

  // Create chat and navigate
  const createAndNavigate = useCallback(async () => {
    const id = await createChat();
    router.push(`/chat/${id}`);
  }, [createChat, router]);

  // Handle settings change
  const handleSettingsChange = useCallback(() => {
    const newConfigured = checkApiConfiguration();
    if (newConfigured && !isConfigured) {
      setIsConfigured(true);
      createAndNavigate();
    }
  }, [checkApiConfiguration, createAndNavigate, isConfigured]);

  useEffect(() => {
    // Initial check
    const configured = checkApiConfiguration();
    setIsConfigured(configured);

    if (configured) {
      createAndNavigate();
      return;
    }

    // Listen for storage events
    window.addEventListener("storage", handleSettingsChange);
    // Listen for our custom event
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsChange);

    return () => {
      window.removeEventListener("storage", handleSettingsChange);
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsChange);
    };
  }, [checkApiConfiguration, createAndNavigate, handleSettingsChange]);

  const handleOpenSettings = () => {
    // Navigate to settings and pass a query parameter to indicate return to chat
    router.push("/settings?returnTo=chat");
  };

  // Show loading state
  if (isConfigured === null) {
    return <NewChatSkeleton />;
  }

  // If not configured, show configuration prompt
  if (!isConfigured) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold">API Configuration Required</h2>
          <p className="text-muted-foreground">
            Please configure your API settings before using AI-related features.
            You need to set up your API key to create and use chat
            functionality.
          </p>
          <Button onClick={handleOpenSettings} className="mt-4">
            Open Settings
          </Button>
        </div>
      </div>
    );
  }

  return <NewChatSkeleton />;
}
