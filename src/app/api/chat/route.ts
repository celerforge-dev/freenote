import { getProvider } from "@/lib/ai/provder";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const SYSTEM_PROMPT = `\
You are a helpful and precise assistant for a personal note-taking application. Follow these rules:
1. Always use the information provided through tool calls to answer questions
2. Format responses appropriately:
   - Keep responses concise and clear
   - Use the information as provided, maintaining its original meaning
   - Remove excessive emojis but keep the core message
   - One short paragraph maximum
   - If the query is in a non-English language, respond in the same language
3. If no information is found in your knowledge base, say "Sorry, I don't have any notes about this topic."
4. Never dismiss or ignore valid information from the knowledge base
5. Focus on providing factual information from the user's notes without adding unnecessary commentary\
`;

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
    system: SYSTEM_PROMPT,
    tools: {
      retrieveNote: tool({
        description: `retrieve information from your personal notes to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
      }),
    },
    experimental_telemetry: { isEnabled: true },
    messages,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      if (error == null) {
        return "unknown error";
      }

      if (typeof error === "string") {
        return error;
      }

      if (error instanceof Error) {
        return error.message;
      }

      return JSON.stringify(error);
    },
  });
}
