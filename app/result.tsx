import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProgressSummary from "../components/ProgressSummary";
import WeekGrid from "../components/WeekGrid";
import {
  getWeeksLived,
  getTotalWeeks,
  getWeeksRemaining,
  getPercentageLived,
  getLifeExpectancy,
} from "../utils/calculations";

export default function ResultScreen() {
  const router = useRouter();
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.9}
        >
          <Text style={styles.backButtonText}>BACK</Text>
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#e8e4de",
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
});
