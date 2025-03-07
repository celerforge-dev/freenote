import "@/app/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { ChatStoreProvider } from "@/contexts/chat-store";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <CookiesProvider>
          <ChatStoreProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 items-center border-b px-2">
                  <SidebarTrigger />
                </header>
                <main>{children}</main>
              </SidebarInset>
            </SidebarProvider>
            {modal}
            <Toaster richColors />
          </ChatStoreProvider>
        </CookiesProvider>
        <Analytics />
      </body>
    </html>
  );
}
