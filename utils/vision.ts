import * as FileSystem from "expo-file-system/legacy";

export interface Vision {
  idealFuture: string;
  worstFuture: string;
  updatedAt: string;
}

const FILE_PATH = `${FileSystem.documentDirectory}weeksleft_vision.json`;

let _cache: Vision | null | undefined = undefined;

export async function getVision(): Promise<Vision | null> {
  if (_cache !== undefined) return _cache;
  try {
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    _cache = JSON.parse(raw);
    return _cache!;
  } catch {
    _cache = null;
    return null;
  }
}

export async function saveVision(idealFuture: string, worstFuture: string): Promise<Vision> {
  const vision: Vision = {
    idealFuture,
    worstFuture,
    updatedAt: new Date().toISOString(),
  };
  _cache = vision;
  await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(vision));
  return vision;
}
