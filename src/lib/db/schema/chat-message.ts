export type ChatMessage = {
  id: string;
  chatId: string;
  role: "system" | "user" | "assistant" | "data";
  content: string;
  createdAt: Date;
};
