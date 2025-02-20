import { ChatInput } from "@/app/chat/chat-input";

export default function Page() {
  return (
    <div className="container flex h-[calc(100vh-64px)] max-w-3xl flex-col gap-4 py-6">
      <div className="flex-1 overflow-auto"></div>
      <div className="sticky bottom-6">
        <ChatInput />
      </div>
    </div>
  );
}
