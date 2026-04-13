import type { JournalStore } from "./journal";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalWeeksJournaled: number;
}

export function calculateStreaks(
  journal: JournalStore,
  currentWeekIndex: number
): StreakData {
  const journaledSet = new Set(Object.keys(journal).map(Number));
  const totalWeeksJournaled = journaledSet.size;

  // Current streak: walk backwards from last week (current week may not be over yet)
  let currentStreak = 0;
  let checkWeek = currentWeekIndex - 1;
  while (checkWeek >= 0 && journaledSet.has(checkWeek)) {
    currentStreak++;
    checkWeek--;
  }
  // Also count current week if journaled
  if (journaledSet.has(currentWeekIndex)) {
    currentStreak++;
  }

  // Longest streak: scan all weeks
  let longestStreak = 0;
  let streak = 0;
  for (let i = 0; i <= currentWeekIndex; i++) {
    if (journaledSet.has(i)) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }

  return { currentStreak, longestStreak, totalWeeksJournaled };
}
