"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { embedMany } from "ai";

const getProvider = (baseUrl: string, apiKey: string) => {
  const provider = createOpenAI({
    baseURL: baseUrl,
    apiKey: apiKey,
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
  baseUrl: string,
  apiKey: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const provider = getProvider(baseUrl, apiKey);
  if (!provider) {
    throw new Error("No provider found.");
  }
  const { embeddings } = await embedMany({
    model: provider.embedding("text-embedding-ada-002"),
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
