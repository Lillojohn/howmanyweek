import { StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProgressSummary from "../components/ProgressSummary";
import WeekGrid from "../components/WeekGrid";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";
import {
  getWeeksLived,
  getTotalWeeks,
  getWeeksRemaining,
  getPercentageLived,
  getLifeExpectancy,
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

  const B = theme.border;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.card,
            borderWidth: B,
            borderColor: theme.colors.border,
            paddingHorizontal: 20,
            paddingVertical: 10,
            alignSelf: "flex-start",
            marginTop: 8,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 3,
          }}
          onPress={() => { lightTap(); router.back(); }}
          activeOpacity={0.9}
        >
          <Text style={{ fontSize: 14, fontWeight: "900", color: theme.colors.text, letterSpacing: 1 }}>
            BACK
          </Text>
        </TouchableOpacity>

        <ProgressSummary
          weeksLived={weeksLived}
          weeksRemaining={weeksRemaining}
          totalWeeks={totalWeeks}
          percentage={percentage}
          lifeExpectancy={lifeExpectancy}
        />

        <WeekGrid weeksLived={weeksLived} totalWeeks={totalWeeks} />
      </ScrollView>
    </SafeAreaView>
  );
}
