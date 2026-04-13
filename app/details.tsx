import { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProgressSummary from "../components/ProgressSummary";
import WeekGridInteractive from "../components/WeekGridInteractive";
import JournalModal from "../components/JournalModal";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";
import { getJournaledWeeks } from "../utils/journal";
import {
  getWeeksLived,
  getTotalWeeks,
  getWeeksRemaining,
  getPercentageLived,
  getLifeExpectancy,
  getCurrentWeekIndex,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);

  const loadJournal = useCallback(async () => {
    const weeks = await getJournaledWeeks();
    setJournaledWeeks(weeks);
  }, []);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  const handleWeekPress = (weekIndex: number) => {
    setSelectedWeek(weekIndex);
    setModalVisible(true);
  };

  const handleThisWeek = () => {
    lightTap();
    setSelectedWeek(currentWeek);
    setModalVisible(true);
  };

  const c = theme.colors;
  const B = theme.border;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: c.card,
              borderWidth: B,
              borderColor: c.border,
              paddingHorizontal: 20,
              paddingVertical: 10,
              shadowColor: c.shadow,
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 3,
            }}
            onPress={() => { lightTap(); router.back(); }}
            activeOpacity={0.9}
          >
            <Text style={{ fontSize: 14, fontWeight: "900", color: c.text, letterSpacing: 1 }}>BACK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: c.green,
              borderWidth: B,
              borderColor: c.border,
              paddingHorizontal: 16,
              paddingVertical: 10,
              shadowColor: c.shadow,
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 3,
            }}
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

        <WeekGridInteractive
          weeksLived={weeksLived}
          totalWeeks={totalWeeks}
          journaledWeeks={journaledWeeks}
          onWeekPress={handleWeekPress}
        />
      </ScrollView>

      <JournalModal
        visible={modalVisible}
        weekIndex={selectedWeek}
        birthday={birthday}
        onClose={() => setModalVisible(false)}
        onSaved={loadJournal}
      />
    </SafeAreaView>
  );
}
