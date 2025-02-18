const STORAGE_KEY = "app_settings";

interface Settings {
  base_url?: string;
  api_key?: string;
}

export const settings = new Proxy<Settings>(
  {},
  {
    get(_: Settings, key: keyof Settings): Settings[typeof key] | undefined {
      const settings = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}",
      ) as Settings;
      return settings[key];
    },

    set(
      _: Settings,
      key: keyof Settings,
      value: Settings[typeof key],
    ): boolean {
      const settings = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}",
      ) as Settings;
      settings[key] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      return true;
    },
  },
);
