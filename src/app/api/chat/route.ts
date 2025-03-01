import { getProvider } from "@/lib/ai/provder";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const provider = await getProvider();
  if (!provider) {
    return new Response(
      "No provider found. Please set API credentials first.",
      {
        status: 400,
      },
    );
  }
  const result = streamText({
    model: provider.chat("gpt-4o-mini"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,

    messages,
  });

  return result.toDataStreamResponse();
}
