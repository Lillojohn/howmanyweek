import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  currentStreak: number;
  totalJournaled: number;
  longestStreak?: number;
}

export default function StreakBadge({ currentStreak, totalJournaled, longestStreak }: Props) {
  const { theme } = useTheme();
  const c = theme.colors;
  const B = theme.border;

  if (totalJournaled === 0) return null;

  return (
    <View style={[styles.container, { borderColor: c.border, borderWidth: B, backgroundColor: c.card }]}>
      <View style={styles.row}>
        <View style={[styles.fireBox, { backgroundColor: c.red, borderColor: c.border, borderWidth: B }]}>
          <Text style={styles.fireEmoji}>🔥</Text>
        </View>
        <View style={styles.textCol}>
          <Text style={[styles.streakNumber, { color: c.text }]}>
            {currentStreak} {currentStreak === 1 ? "WEEK" : "WEEKS"}
          </Text>
          <Text style={[styles.streakLabel, { color: c.textSecondary }]}>
            STREAK · {totalJournaled} TOTAL{longestStreak != null ? ` · LONGEST: ${longestStreak}` : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    width: "100%",
    padding: 12,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  fireBox: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  fireEmoji: { fontSize: 20 },
  textCol: { flex: 1 },
  streakNumber: { fontSize: 16, fontWeight: "900", letterSpacing: 1 },
  streakLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginTop: 2 },
});
