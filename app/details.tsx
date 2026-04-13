import { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProgressSummary from "../components/ProgressSummary";
import WeekGridInteractive from "../components/WeekGridInteractive";
import JournalModal from "../components/JournalModal";
import MilestoneModal from "../components/MilestoneModal";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";
import { getJournal, getJournaledWeeks } from "../utils/journal";
import { getMilestoneWeeks, getAllMilestonesSorted } from "../utils/milestones";
import { calculateStreaks } from "../utils/streaks";
import type { Milestone } from "../utils/milestones";
import type { StreakData } from "../utils/streaks";
import {
  getWeeksLived,
  getTotalWeeks,
  getWeeksRemaining,
  getPercentageLived,
  getLifeExpectancy,
  getCurrentWeekIndex,
  getWeekDateRange,
} from "../utils/calculations";

export default function DetailsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    birthday: string;
    country: string;
    gender: string;
  }>();

  const birthday = new Date(params.birthday!);
  const country = params.country!;
  const gender = params.gender as "male" | "female";

  const weeksLived = getWeeksLived(birthday);
  const totalWeeks = getTotalWeeks(country, gender);
  const weeksRemaining = getWeeksRemaining(birthday, country, gender);
  const percentage = getPercentageLived(birthday, country, gender);
  const lifeExpectancy = getLifeExpectancy(country, gender);
  const currentWeek = getCurrentWeekIndex(birthday);

  const [journaledWeeks, setJournaledWeeks] = useState<Set<number>>(new Set());
  const [milestoneWeeks, setMilestoneWeeks] = useState<Map<number, Milestone>>(new Map());
  const [milestoneList, setMilestoneList] = useState<Milestone[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, totalWeeksJournaled: 0 });

  const [journalModalVisible, setJournalModalVisible] = useState(false);
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);

  const loadData = useCallback(async () => {
    const [weeks, msWeeks, msList, journal] = await Promise.all([
      getJournaledWeeks(),
      getMilestoneWeeks(),
      getAllMilestonesSorted(),
      getJournal(),
    ]);
    setJournaledWeeks(weeks);
    setMilestoneWeeks(msWeeks);
    setMilestoneList(msList);
    setStreakData(calculateStreaks(journal, currentWeek));
  }, [currentWeek]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWeekPress = (weekIndex: number) => {
    setSelectedWeek(weekIndex);
    setJournalModalVisible(true);
  };

  const handleWeekLongPress = (weekIndex: number) => {
    setSelectedWeek(weekIndex);
    setMilestoneModalVisible(true);
  };

  const handleThisWeek = () => {
    lightTap();
    setSelectedWeek(currentWeek);
    setJournalModalVisible(true);
  };

  const c = theme.colors;
  const B = theme.border;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}>
        {/* Top bar */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, marginBottom: 16 }}>
          <TouchableOpacity
            style={{ backgroundColor: c.card, borderWidth: B, borderColor: c.border, paddingHorizontal: 20, paddingVertical: 10, shadowColor: c.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 }}
            onPress={() => { lightTap(); router.back(); }}
            activeOpacity={0.9}
          >
            <Text style={{ fontSize: 14, fontWeight: "900", color: c.text, letterSpacing: 1 }}>BACK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: c.green, borderWidth: B, borderColor: c.border, paddingHorizontal: 16, paddingVertical: 10, shadowColor: c.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 }}
            onPress={handleThisWeek}
            activeOpacity={0.9}
          >
            <Text style={{ fontSize: 14, fontWeight: "900", color: "#000", letterSpacing: 1 }}>THIS WEEK</Text>
          </TouchableOpacity>
        </View>

        <ProgressSummary
          weeksLived={weeksLived}
          weeksRemaining={weeksRemaining}
          totalWeeks={totalWeeks}
          percentage={percentage}
          lifeExpectancy={lifeExpectancy}
        />

        {/* Streak badge */}
        {streakData.totalWeeksJournaled > 0 && (
          <View style={{ marginTop: 12, borderWidth: B, borderColor: c.border, backgroundColor: c.card, padding: 12, shadowColor: c.shadow, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ backgroundColor: c.red, borderWidth: B, borderColor: c.border, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 20 }}>🔥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "900", color: c.text, letterSpacing: 1 }}>
                  {streakData.currentStreak} WEEK STREAK
                </Text>
                <Text style={{ fontSize: 10, fontWeight: "800", color: c.textSecondary, letterSpacing: 0.5, marginTop: 2 }}>
                  {streakData.totalWeeksJournaled} WEEKS JOURNALED · LONGEST: {streakData.longestStreak}
                </Text>
              </View>
            </View>
          </View>
        )}

        <WeekGridInteractive
          weeksLived={weeksLived}
          totalWeeks={totalWeeks}
          journaledWeeks={journaledWeeks}
          milestoneWeeks={milestoneWeeks}
          onWeekPress={handleWeekPress}
          onWeekLongPress={handleWeekLongPress}
        />

        {/* Milestones list */}
        {milestoneList.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <View style={{ backgroundColor: c.purple, borderWidth: B, borderColor: c.border, borderBottomWidth: 0, paddingVertical: 8, paddingHorizontal: 16, alignSelf: "flex-start", marginLeft: 12, zIndex: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: "900", color: "#000", letterSpacing: 1 }}>MILESTONES</Text>
            </View>
            <View style={{ backgroundColor: c.card, borderWidth: B, borderColor: c.border, shadowColor: c.shadow, shadowOffset: { width: 5, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 }}>
              {milestoneList.map((ms, i) => {
                const { start } = getWeekDateRange(ms.weekIndex, birthday);
                return (
                  <TouchableOpacity
                    key={ms.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      gap: 12,
                      borderBottomWidth: i < milestoneList.length - 1 ? 2 : 0,
                      borderBottomColor: c.border,
                    }}
                    onPress={() => { setSelectedWeek(ms.weekIndex); setMilestoneModalVisible(true); }}
                    activeOpacity={0.9}
                  >
                    <View style={{ backgroundColor: ms.color, borderWidth: 2, borderColor: c.border, width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 18 }}>{ms.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "900", color: c.text, letterSpacing: 0.5 }}>{ms.label}</Text>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: c.textSecondary, marginTop: 2 }}>
                        WEEK {ms.weekIndex + 1} · {formatDate(start)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Hint */}
        <Text style={{ fontSize: 10, fontWeight: "700", color: c.textSecondary, textAlign: "center", marginTop: 16, letterSpacing: 0.5 }}>
          TAP A WEEK TO JOURNAL · LONG-PRESS TO ADD A MILESTONE
        </Text>
      </ScrollView>

      <JournalModal
        visible={journalModalVisible}
        weekIndex={selectedWeek}
        birthday={birthday}
        onClose={() => setJournalModalVisible(false)}
        onSaved={loadData}
      />

      <MilestoneModal
        visible={milestoneModalVisible}
        weekIndex={selectedWeek}
        birthday={birthday}
        onClose={() => setMilestoneModalVisible(false)}
        onSaved={loadData}
      />
    </SafeAreaView>
  );
}
