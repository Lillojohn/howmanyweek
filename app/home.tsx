import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getUserData, UserData, clearUserData } from "../utils/storage";
import {
  getWeeksLived,
  getWeeksRemaining,
  getTotalWeeks,
  getPercentageLived,
  getLifeExpectancy,
} from "../utils/calculations";

const QUOTES = [
  "What will you do with this week?",
  "Make this one count.",
  "Not infinite. Not zero. Go.",
  "The best week of your life could be this one.",
  "What's the one thing that matters today?",
  "You're still here. That's the start.",
  "Another week. Another chance.",
  "Don't count the days. Make the days count.",
  "This week is a gift. Use it.",
  "Your time is limited. Don't waste it.",
];

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    getUserData().then((d) => {
      if (!d) {
        router.replace("/setup");
        return;
      }
      setData(d);
    });
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!data) return null;

  const birthday = new Date(data.birthday);
  const weeksRemaining = getWeeksRemaining(birthday, data.country, data.gender);
  const weeksLived = getWeeksLived(birthday);
  const totalWeeks = getTotalWeeks(data.country, data.gender);
  const percentage = getPercentageLived(birthday, data.country, data.gender);
  const lifeExpectancy = getLifeExpectancy(data.country, data.gender);

  const handleReset = async () => {
    await clearUserData();
    router.replace("/setup");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>RESET</Text>
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.center}>
          <View style={styles.weekCard}>
            <Text style={styles.bigNumber}>
              {weeksRemaining.toLocaleString()}
            </Text>
            <Text style={styles.weeksLabel}>WEEKS LEFT</Text>
          </View>

          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{quote}</Text>
          </View>

          <View style={styles.miniStats}>
            <Text style={styles.miniStatText}>
              WEEK {weeksLived.toLocaleString()} OF {totalWeeks.toLocaleString()}
            </Text>
            <View style={styles.miniProgressBar}>
              <View
                style={[
                  styles.miniProgressFill,
                  { width: `${Math.min(percentage, 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Bottom button */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() =>
            router.push({
              pathname: "/details",
              params: {
                birthday: data.birthday,
                country: data.country,
                gender: data.gender,
              },
            })
          }
          activeOpacity={0.9}
        >
          <Text style={styles.detailsButtonText}>SEE ALL DATA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BORDER = 3;
const SHADOW = 5;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#e8e4de" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  resetButton: {
    backgroundColor: "#fff",
    borderWidth: BORDER,
    borderColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  resetText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  center: {
    alignItems: "center",
    gap: 20,
  },
  weekCard: {
    backgroundColor: "#fff",
    borderWidth: BORDER,
    borderColor: "#000",
    paddingVertical: 40,
    paddingHorizontal: 48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: SHADOW, height: SHADOW },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    transform: [{ rotate: "-0.5deg" }],
  },
  bigNumber: {
    fontSize: 80,
    fontWeight: "900",
    color: "#000",
    fontVariant: ["tabular-nums"],
    lineHeight: 88,
  },
  weeksLabel: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 4,
    marginTop: 4,
  },
  quoteCard: {
    backgroundColor: "#FFD93D",
    borderWidth: BORDER,
    borderColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    transform: [{ rotate: "0.5deg" }],
  },
  quoteText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
  },
  miniStats: {
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  miniStatText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  miniProgressBar: {
    width: "80%",
    height: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: "#FF6B6B",
  },
  detailsButton: {
    backgroundColor: "#000",
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: BORDER,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: SHADOW, height: SHADOW },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
  },
});
