export function generateChatTitle(message: string): string {
  if (!message || message.trim().length === 0) {
    return "New Chat";
  }

  try {
    // Extract the first few words as the title
    const words = message.trim().split(/\s+/);

    // If message is short, use the entire message
    if (words.length <= 5) {
      return message.length <= 30 ? message : message.substring(0, 27) + "...";
    }

    // Otherwise take the first 5 words
    const title = words.slice(0, 5).join(" ");
    return title.length <= 30 ? title : title.substring(0, 27) + "...";
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Chat"; // Default title if generation fails
  }
}
