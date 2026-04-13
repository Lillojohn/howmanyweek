import * as FileSystem from "expo-file-system";

export interface Milestone {
  id: string;
  weekIndex: number;
  label: string;
  emoji: string;
  color: string;
  createdAt: string;
}

export type MilestoneStore = Record<number, Milestone>;

const FILE_PATH = `${FileSystem.documentDirectory}weeksleft_milestones.json`;

async function readStore(): Promise<MilestoneStore> {
  try {
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeStore(store: MilestoneStore): Promise<void> {
  await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(store));
}

export async function getMilestones(): Promise<MilestoneStore> {
  return readStore();
}

export async function getMilestone(weekIndex: number): Promise<Milestone | null> {
  const store = await readStore();
  return store[weekIndex] ?? null;
}

export async function saveMilestone(
  weekIndex: number,
  label: string,
  emoji: string,
  color: string
): Promise<Milestone> {
  const store = await readStore();
  const existing = store[weekIndex];

  const milestone: Milestone = {
    id: existing?.id ?? `ms_${Date.now()}`,
    weekIndex,
    label,
    emoji,
    color,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  store[weekIndex] = milestone;
  await writeStore(store);
  return milestone;
}

export async function deleteMilestone(weekIndex: number): Promise<void> {
  const store = await readStore();
  delete store[weekIndex];
  await writeStore(store);
}

export async function getMilestoneWeeks(): Promise<Map<number, Milestone>> {
  const store = await readStore();
  return new Map(Object.entries(store).map(([k, v]) => [Number(k), v]));
}

export async function getAllMilestonesSorted(): Promise<Milestone[]> {
  const store = await readStore();
  return Object.values(store).sort((a, b) => a.weekIndex - b.weekIndex);
}
