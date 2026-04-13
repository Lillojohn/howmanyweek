import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "weeksleft_user_data";

export interface UserData {
  birthday: string; // ISO string
  country: string;
  gender: "male" | "female";
}

export async function saveUserData(data: UserData): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(data));
}

export async function getUserData(): Promise<UserData | null> {
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function clearUserData(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
