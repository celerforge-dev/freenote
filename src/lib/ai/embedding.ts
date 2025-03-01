"use server";

import { getProvider } from "@/lib/ai/provder";
import { embedMany } from "ai";
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
  const provider = await getProvider();
  if (!provider) {
    throw new Error("No provider found. Please set API credentials first.");
  }
  const { embeddings } = await embedMany({
    model: provider.embedding("text-embedding-ada-002"),
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
