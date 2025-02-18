import { settings } from "@/lib/settings";
import { createOpenAI } from "@ai-sdk/openai";
import { embedMany } from "ai";

const getProvider = () => {
  const provider = createOpenAI({
    baseURL: settings.base_url,
    apiKey: settings.api_key,
  });
  return provider;
};

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split("\n\n")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const provider = getProvider();
  if (!provider) {
    throw new Error("No provider found.");
  }
  const { embeddings } = await embedMany({
    model: provider.embedding("text-embedding-ada-002"),
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
