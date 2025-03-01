export const SETTINGS = {
  ai: {
    provider: {
      baseUrl: "settings.ai.provider.baseUrl",
      apiKey: "settings.ai.provider.apiKey",
    },
    options: {
      model: "settings.ai.options.model",
    },
  },
  theme: {
    mode: "settings.theme.mode",
  },
} as const;

// Type helper for getting nested values
type SettingsValue<T> =
  T extends Record<string, unknown>
    ? { [K in keyof T]: SettingsValue<T[K]> }
    : string;

// Inferred settings type
export type Settings = SettingsValue<typeof SETTINGS>;
