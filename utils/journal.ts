import * as FileSystem from "expo-file-system/legacy";

export interface JournalEntry {
  weekIndex: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export type JournalStore = Record<number, JournalEntry>;

const FILE_PATH = `${FileSystem.documentDirectory}weeksleft_journal.json`;

let _cache: JournalStore | null = null;

async function readStore(): Promise<JournalStore> {
  if (_cache) return _cache;
  try {
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    _cache = JSON.parse(raw);
    return _cache!;
  } catch {
    _cache = {};
    return _cache;
  }
}

async function writeStore(store: JournalStore): Promise<void> {
  _cache = store;
  await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(store));
}

export async function getJournal(): Promise<JournalStore> {
  return { ...(await readStore()) };
}

export async function getEntry(weekIndex: number): Promise<JournalEntry | null> {
  const store = await readStore();
  return store[weekIndex] ?? null;
}

export async function saveEntry(weekIndex: number, text: string): Promise<JournalEntry> {
  const store = await readStore();
  const now = new Date().toISOString();
  const existing = store[weekIndex];

  const entry: JournalEntry = {
    weekIndex,
    text,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  store[weekIndex] = entry;
  await writeStore(store);
  return entry;
}

export async function deleteEntry(weekIndex: number): Promise<void> {
  const store = await readStore();
  delete store[weekIndex];
  await writeStore(store);
}

export async function getJournaledWeeks(): Promise<Set<number>> {
  const store = await readStore();
  return new Set(Object.keys(store).map(Number));
}
