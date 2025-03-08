"use server";

import { getProvider } from "@/lib/ai/provder";
import { embed, embedMany } from "ai";
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split("\n\n")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string,
  context?: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const input = value.replaceAll("\\n", " ");
  const chunks = generateChunks(input);
  const provider = await getProvider();
  if (!provider) {
    throw new Error("No provider found. Please set API credentials first.");
  }

  // Combine context with each chunk if context is provided
  const chunksWithContext = chunks.map((chunk) =>
    context ? `${context}\n${chunk}` : chunk,
  );

  const { embeddings } = await embedMany({
    model: provider.embedding("text-embedding-ada-002"),
    values: chunksWithContext,
  });

  return embeddings.map((e, i) => ({
    content: chunks[i],
    embedding: e,
  }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const provider = await getProvider();
  if (!provider) {
    throw new Error("No provider found. Please set API credentials first.");
  }
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: provider.embedding("text-embedding-ada-002"),
    value: input,
  });
  return embedding;
};
