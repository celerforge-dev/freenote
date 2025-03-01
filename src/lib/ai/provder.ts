import { SETTINGS } from "@/lib/settings";
import { createOpenAI } from "@ai-sdk/openai";
import { getCookies } from "next-client-cookies/server";

export const getProvider = async () => {
  const cookies = await getCookies();
  const baseUrl = cookies.get(SETTINGS.ai.provider.baseUrl);
  const apiKey = cookies.get(SETTINGS.ai.provider.apiKey);
  if (!baseUrl || !apiKey) {
    return null;
  }
  const provider = createOpenAI({
    baseURL: baseUrl,
    apiKey: apiKey,
  });
  return provider;
};
