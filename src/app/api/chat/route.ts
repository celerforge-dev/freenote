import { getProvider } from "@/lib/ai/provder";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const SYSTEM_PROMPT = `\
You are a helpful and precise assistant for a personal note-taking application. Follow these rules:
1. Only answer what is explicitly asked in the question
2. Never include information that wasn't specifically asked for
3. Format responses:
   - Keep it concise
   - One short paragraph
   - Include dates as YYYY/MM/DD when available
   - Use the same language as the question
4. If no relevant information found, say "Sorry, I don't have any notes about this topic."\
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
        description: `retrieve information from your personal notes that EXACTLY matches the user's question. Only return information that directly answers the specific question asked. Filter out any unrelated information even if it appears in the same note.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          filterUnrelated: z
            .boolean()
            .default(true)
            .describe(
              "whether to filter out unrelated information from the same note",
            ),
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
