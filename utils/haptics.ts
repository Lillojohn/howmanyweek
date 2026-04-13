import * as Haptics from "expo-haptics";
import { getSettings } from "./settings";

let _enabled: boolean | null = null;

async function isEnabled(): Promise<boolean> {
  if (_enabled !== null) return _enabled;
  const settings = await getSettings();
  _enabled = settings.hapticsEnabled;
  return _enabled;
}

export function setHapticsEnabled(enabled: boolean) {
  _enabled = enabled;
}

export async function lightTap() {
  if (await isEnabled()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export async function mediumTap() {
  if (await isEnabled()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export async function successTap() {
  if (await isEnabled()) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}
