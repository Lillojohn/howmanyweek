import * as FileSystem from "expo-file-system/legacy";

export const CATEGORIES = ["health", "relationships", "work", "growth", "meaning"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  health: "HEALTH",
  relationships: "RELATIONSHIPS",
  work: "WORK",
  growth: "GROWTH",
  meaning: "MEANING",
};

export interface CategoryRatings {
  health: number;
  relationships: number;
  work: number;
  growth: number;
  meaning: number;
}

export interface JournalEntry {
  weekIndex: number;
  ratings: CategoryRatings;
  prompts: {
    meaningful: string;
    avoiding: string;
    intention: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type JournalStore = Record<number, JournalEntry>;

const FILE_PATH = `${FileSystem.documentDirectory}weeksleft_journal.json`;

let _cache: JournalStore | null = null;

function migrateEntry(raw: any): JournalEntry {
  // Old format had just `text: string`
  if (raw.text !== undefined && raw.ratings === undefined) {
    return {
      weekIndex: raw.weekIndex,
      ratings: { health: 0, relationships: 0, work: 0, growth: 0, meaning: 0 },
      prompts: {
        meaningful: raw.text || "",
        avoiding: "",
        intention: "",
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
  return raw;
}

async function readStore(): Promise<JournalStore> {
  if (_cache) return _cache;
  try {
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    const parsed = JSON.parse(raw);
    // Migrate any old entries
    const migrated: JournalStore = {};
    for (const [key, entry] of Object.entries(parsed)) {
      migrated[Number(key)] = migrateEntry(entry);
    }
    _cache = migrated;
    return _cache;
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

export async function saveEntry(
  weekIndex: number,
  ratings: CategoryRatings,
  prompts: { meaningful: string; avoiding: string; intention: string }
): Promise<JournalEntry> {
  const store = await readStore();
  const now = new Date().toISOString();
  const existing = store[weekIndex];

  const entry: JournalEntry = {
    weekIndex,
    ratings,
    prompts,
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

export function getAverageRating(entry: JournalEntry): number {
  const vals = Object.values(entry.ratings);
  const rated = vals.filter((v) => v > 0);
  if (rated.length === 0) return 0;
  return rated.reduce((a, b) => a + b, 0) / rated.length;
}

export function getCategoryRating(entry: JournalEntry, category: Category): number {
  return entry.ratings[category];
}

const EMPTY_RATINGS: CategoryRatings = { health: 0, relationships: 0, work: 0, growth: 0, meaning: 0 };

export function emptyRatings(): CategoryRatings {
  return { ...EMPTY_RATINGS };
}
