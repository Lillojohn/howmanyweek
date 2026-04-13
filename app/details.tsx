import { useState, useEffect, useCallback, useRef } from "react";
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProgressSummary from "../components/ProgressSummary";
import WeekGridInteractive from "../components/WeekGridInteractive";
import JournalModal from "../components/JournalModal";
import MilestoneModal from "../components/MilestoneModal";
import ShareCard from "../components/ShareCard";
import StreakBadge from "../components/StreakBadge";
import CategoryFilter from "../components/CategoryFilter";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";
import { captureAndShare } from "../utils/share";
import { getJournal, type JournalStore, type Category } from "../utils/journal";
import { getMilestoneWeeks, getAllMilestonesSorted } from "../utils/milestones";
import { calculateStreaks } from "../utils/streaks";
import type { Milestone } from "../utils/milestones";
import type { StreakData } from "../utils/streaks";
import type { Theme } from "../constants/theme";
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

  const [journalData, setJournalData] = useState<JournalStore>({});
  const [milestoneWeeks, setMilestoneWeeks] = useState<Map<number, Milestone>>(new Map());
  const [milestoneList, setMilestoneList] = useState<Milestone[]>([]);
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, totalWeeksJournaled: 0 });
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [previousIntention, setPreviousIntention] = useState("");

  const [journalModalVisible, setJournalModalVisible] = useState(false);
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const shareRef = useRef<View>(null);

  const loadData = useCallback(async () => {
    const [journal, msWeeks, msList] = await Promise.all([
      getJournal(),
      getMilestoneWeeks(),
      getAllMilestonesSorted(),
    ]);
    setJournalData(journal);
    setMilestoneWeeks(msWeeks);
    setMilestoneList(msList);
    setStreakData(calculateStreaks(journal, currentWeek));

    // Get previous week's intention for the journal modal
    const prevEntry = journal[currentWeek - 1];
    setPreviousIntention(prevEntry?.prompts?.intention ?? "");
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
  const s = makeStyles(theme);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Top bar */}
        <View style={s.topBar}>
          <TouchableOpacity
            style={[s.button, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={() => { lightTap(); router.back(); }}
            activeOpacity={0.9}
          >
            <Text style={[s.buttonText, { color: c.text }]}>BACK</Text>
          </TouchableOpacity>

          <View style={s.rightButtons}>
            <TouchableOpacity
              style={[s.button, { backgroundColor: c.yellow, borderColor: c.border }]}
              onPress={() => { lightTap(); captureAndShare(shareRef); }}
              activeOpacity={0.9}
            >
              <Text style={s.buttonTextDark}>SHARE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.button, { backgroundColor: c.green, borderColor: c.border }]}
              onPress={handleThisWeek}
              activeOpacity={0.9}
            >
              <Text style={s.buttonTextDark}>THIS WEEK</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ProgressSummary
          weeksLived={weeksLived}
          weeksRemaining={weeksRemaining}
          totalWeeks={totalWeeks}
          percentage={percentage}
          lifeExpectancy={lifeExpectancy}
        />

        {streakData.totalWeeksJournaled > 0 && (
          <View style={{ marginTop: 12 }}>
            <StreakBadge
              currentStreak={streakData.currentStreak}
              totalJournaled={streakData.totalWeeksJournaled}
              longestStreak={streakData.longestStreak}
            />
          </View>
        )}

        <View style={{ marginTop: 12 }}>
          <CategoryFilter
            activeFilter={categoryFilter}
            onFilterChange={setCategoryFilter}
          />
        </View>

        <WeekGridInteractive
          weeksLived={weeksLived}
          totalWeeks={totalWeeks}
          journalData={journalData}
          milestoneWeeks={milestoneWeeks}
          categoryFilter={categoryFilter}
          onWeekPress={handleWeekPress}
          onWeekLongPress={handleWeekLongPress}
        />

        {/* Milestones list */}
        {milestoneList.length > 0 && (
          <View style={s.milestonesSection}>
            <View style={[s.milestonesTab, { backgroundColor: c.purple, borderColor: c.border }]}>
              <Text style={s.buttonTextDark}>MILESTONES</Text>
            </View>
            <View style={[s.milestonesCard, { backgroundColor: c.card, borderColor: c.border }]}>
              {milestoneList.map((ms, i) => {
                const { start } = getWeekDateRange(ms.weekIndex, birthday);
                return (
                  <TouchableOpacity
                    key={ms.id}
                    style={[
                      s.milestoneRow,
                      { borderBottomColor: c.border },
                      i === milestoneList.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => { setSelectedWeek(ms.weekIndex); setMilestoneModalVisible(true); }}
                    activeOpacity={0.9}
                  >
                    <View style={[s.milestoneIcon, { backgroundColor: ms.color, borderColor: c.border }]}>
                      <Text style={{ fontSize: 18 }}>{ms.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.milestoneLabel, { color: c.text }]}>{ms.label}</Text>
                      <Text style={[s.milestoneDate, { color: c.textSecondary }]}>
                        WEEK {ms.weekIndex + 1} · {formatDate(start)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <Text style={[s.hint, { color: c.textSecondary }]}>
          TAP A WEEK TO JOURNAL · LONG-PRESS TO ADD A MILESTONE
        </Text>
      </ScrollView>

      {/* Hidden share card for capture */}
      <View style={s.offscreen}>
        <ShareCard
          ref={shareRef}
          weeksLived={weeksLived}
          weeksRemaining={weeksRemaining}
          totalWeeks={totalWeeks}
          percentage={percentage}
        />
      </View>

      <JournalModal
        visible={journalModalVisible}
        weekIndex={selectedWeek}
        birthday={birthday}
        previousIntention={previousIntention}
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

function makeStyles(theme: Theme) {
  const B = theme.border;
  const S = theme.shadow;

  return StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingBottom: 40, paddingHorizontal: 16 },
    topBar: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, marginBottom: 16 },
    rightButtons: { flexDirection: "row", gap: 8 },
    button: {
      borderWidth: B,
      paddingHorizontal: 16,
      paddingVertical: 10,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    buttonText: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
    buttonTextDark: { fontSize: 14, fontWeight: "900", color: "#000", letterSpacing: 1 },
    milestonesSection: { marginTop: 12 },
    milestonesTab: {
      borderWidth: B,
      borderBottomWidth: 0,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignSelf: "flex-start",
      marginLeft: 12,
      zIndex: 2,
    },
    milestonesCard: {
      borderWidth: B,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: S, height: S },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
    },
    milestoneRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      gap: 12,
      borderBottomWidth: 2,
    },
    milestoneIcon: {
      borderWidth: 2,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    milestoneLabel: { fontSize: 14, fontWeight: "900", letterSpacing: 0.5 },
    milestoneDate: { fontSize: 10, fontWeight: "700", marginTop: 2 },
    hint: { fontSize: 10, fontWeight: "700", textAlign: "center", marginTop: 16, letterSpacing: 0.5 },
    offscreen: { position: "absolute", left: -9999 },
  });
}
