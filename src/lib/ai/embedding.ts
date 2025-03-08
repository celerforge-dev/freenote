"use server";

import { getProvider } from "@/lib/ai/provder";
import { embed, embedMany } from "ai";

// Optimized Markdown chunking function
const generateChunks = (input: string): string[] => {
  // Return empty array if input is empty
  if (!input || input.trim() === "") {
    return [];
  }

  const trimmedInput = input.trim();

  // Regex to identify Markdown headers
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;

  // Regex to identify code blocks
  const codeBlockRegex = /```[\s\S]*?```/g;

  // Store all code blocks
  const codeBlocks: string[] = [];
  let codeBlockCounter = 0;

  // Replace code blocks with placeholders for processing
  const withoutCodeBlocks = trimmedInput.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlockCounter++}__`;
  });

  // Split text by headers
  const sections: string[] = [];
  let currentSection = "";
  let lastIndex = 0;

  // Find all headers
  const matches = [...withoutCodeBlocks.matchAll(headerRegex)];

  if (matches.length === 0) {
    // If no headers found, split by paragraphs
    return withoutCodeBlocks
      .split("\n\n")
      .filter((chunk) => chunk.trim() !== "")
      .map((chunk) => {
        // Restore code blocks
        return chunk.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
          return codeBlocks[parseInt(index, 10)];
        });
      });
  }

  // Split by headers
  matches.forEach((match, index) => {
    const [fullMatch] = match;
    const matchIndex = match.index as number;

    // If not the first header, add content between previous and current header as a chunk
    if (index > 0) {
      const sectionContent = withoutCodeBlocks
        .substring(lastIndex, matchIndex)
        .trim();
      if (sectionContent) {
        currentSection += sectionContent;
        sections.push(currentSection);
      }
    }

    // Update current section and lastIndex
    currentSection = fullMatch + "\n";
    lastIndex = matchIndex + fullMatch.length;

    // If it's the last header, add remaining content as a chunk
    if (index === matches.length - 1) {
      const remainingContent = withoutCodeBlocks.substring(lastIndex).trim();
      if (remainingContent) {
        currentSection += remainingContent;
        sections.push(currentSection);
      }
    }
  });

  // If there's content before the first header, add it as a chunk
  if (matches.length > 0 && matches[0].index! > 0) {
    const initialContent = withoutCodeBlocks
      .substring(0, matches[0].index)
      .trim();
    if (initialContent) {
      sections.unshift(initialContent);
    }
  }

  // If no sections found, return original input as a single chunk
  if (sections.length === 0) {
    sections.push(trimmedInput);
  }

  // Restore code blocks
  return sections.map((section) => {
    return section.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
      return codeBlocks[parseInt(index, 10)];
    });
  });
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
    content: chunksWithContext[i],
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
