import * as SecureStore from "expo-secure-store";

const SETTINGS_KEY = "weeksleft_settings";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  notificationTone: "blunt" | "gentle" | "stoic";
  hapticsEnabled: boolean;
  onboardingSeen: boolean;
}

const DEFAULTS: AppSettings = {
  theme: "system",
  notificationTone: "blunt",
  hapticsEnabled: true,
  onboardingSeen: false,
};

export async function getSettings(): Promise<AppSettings> {
  const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
  if (!raw) return { ...DEFAULTS };
  return { ...DEFAULTS, ...JSON.parse(raw) };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
}

export async function saveSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): Promise<void> {
  const current = await getSettings();
  current[key] = value;
  await saveSettings(current);
}
