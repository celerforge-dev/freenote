"use client";

import { Icons } from "@/components/icons";
import { Logo } from "@/components/logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/contexts/chat-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const { chats, isLoading } = useChatStore();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Icons.notebookPen />
                  <span>Journal</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/knowledge"}>
                <Link href="/knowledge">
                  <Icons.bookOpenText />
                  <span>Knowledge</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>AI</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible className="group/collapsible" defaultOpen>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/chat"}
                  className="group/chat flex"
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    <Icons.botMessageSquare className="block transition-opacity duration-200 group-hover/chat:hidden" />
                    <CollapsibleTrigger asChild>
                      <Icons.chevronRight className="-ml-1 hidden h-5 w-5 rounded transition-transform duration-200 hover:bg-neutral-200 group-hover/chat:block group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </div>
                  <Link
                    href="/chat"
                    className="flex flex-1 items-center justify-between"
                  >
                    Chat
                    <Icons.circlePlus className="hidden h-4 w-4 group-hover/chat:block" />
                  </Link>
                </SidebarMenuButton>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {isLoading ? (
                      <SidebarMenuSubItem>
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Loading chats...
                        </div>
                      </SidebarMenuSubItem>
                    ) : chats.length === 0 ? (
                      <SidebarMenuSubItem>
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No chats yet
                        </div>
                      </SidebarMenuSubItem>
                    ) : (
                      chats.map((chat) => (
                        <SidebarMenuSubItem key={chat.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === `/chat/${chat.id}`}
                          >
                            <Link href={`/chat/${chat.id}`}>
                              <span>{chat.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href="/settings" scroll={false}>
                  <Icons.settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
