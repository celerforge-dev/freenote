"use client";

import { Icons } from "@/components/icons";
import { Logo } from "@/components/logo";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { chats, isLoading, deleteChat } = useChatStore();

  const handleDelete = async (chatId: string) => {
    await deleteChat(chatId);
    router.push("/chat");
  };

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
            <Collapsible className="group/collapsible" defaultOpen={false}>
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
                    title="New chat"
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
                          <AlertDialog>
                            <ContextMenu>
                              <ContextMenuTrigger>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === `/chat/${chat.id}`}
                                >
                                  <Link href={`/chat/${chat.id}`}>
                                    <span>{chat.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </ContextMenuTrigger>
                              <ContextMenuContent>
                                <ContextMenuItem>
                                  <AlertDialogTrigger className="w-full text-left text-destructive">
                                    Delete Chat
                                  </AlertDialogTrigger>
                                </ContextMenuItem>
                              </ContextMenuContent>
                            </ContextMenu>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete this chat and all its
                                  messages.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(chat.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <Link
            href="https://github.com/celerforge/freenote"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground transition-colors hover:text-sidebar-accent-foreground"
            title="GitHub"
          >
            <Icons.github className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com/celerforge/freenote/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground transition-colors hover:text-sidebar-accent-foreground"
            title="FAQ & Help"
          >
            <Icons.circleHelp className="h-5 w-5" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
