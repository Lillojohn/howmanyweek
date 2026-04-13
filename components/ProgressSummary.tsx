import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  percentage: number;
  lifeExpectancy: number;
}

export default function ProgressSummary({
  weeksLived,
  weeksRemaining,
  totalWeeks,
  percentage,
  lifeExpectancy,
}: Props) {
  const { theme } = useTheme();
  const yearsRemaining = (weeksRemaining / 52.1429).toFixed(1);
  const B = theme.border;
  const S = theme.shadow;
  const c = theme.colors;

  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: S, height: S } }]}>
        <Text style={[styles.bigNumber, { color: c.text }]}>{weeksRemaining.toLocaleString()}</Text>
        <Text style={[styles.label, { color: c.text }]}>WEEKS REMAINING</Text>
      </View>

      <View style={[styles.subCard, { backgroundColor: c.purple, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: 3, height: 3 } }]}>
        <Text style={styles.subLabel}>
          ~{yearsRemaining} YEARS (AVG. LIFE EXPECTANCY: {lifeExpectancy} YRS)
        </Text>
      </View>

      <View style={[styles.progressCard, { backgroundColor: c.card, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: 4, height: 4 } }]}>
        <View style={[styles.progressBar, { backgroundColor: c.gridRemaining, borderColor: c.border }]}>
          <View style={[styles.progressFill, { backgroundColor: c.progressFill, width: `${Math.min(percentage, 100)}%` }]} />
        </View>
        <Text style={[styles.progressText, { color: c.text }]}>{percentage.toFixed(1)}% DONE</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={[styles.statCard, { backgroundColor: c.green, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: 3, height: 3 } }]}>
          <Text style={styles.statNumber}>{weeksLived.toLocaleString()}</Text>
          <Text style={styles.statLabel}>LIVED</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: c.yellow, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: 3, height: 3 } }]}>
          <Text style={styles.statNumber}>{totalWeeks.toLocaleString()}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: c.red, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: 3, height: 3 } }]}>
          <Text style={styles.statNumber}>{weeksRemaining.toLocaleString()}</Text>
          <Text style={styles.statLabel}>LEFT</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    alignItems: "center",
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  bigNumber: { fontSize: 64, fontWeight: "900", fontVariant: ["tabular-nums"] },
  label: { fontSize: 16, fontWeight: "900", letterSpacing: 2, marginTop: 4 },
  subCard: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  subLabel: { fontSize: 11, fontWeight: "800", color: "#000", letterSpacing: 0.5, textAlign: "center" },
  progressCard: {
    padding: 16,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  progressBar: {
    width: "100%",
    height: 20,
    borderWidth: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%" },
  progressText: { fontSize: 12, fontWeight: "900", textAlign: "center", marginTop: 8, letterSpacing: 1 },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statNumber: { fontSize: 16, fontWeight: "900", color: "#000", fontVariant: ["tabular-nums"] },
  statLabel: { fontSize: 10, fontWeight: "800", color: "#000", marginTop: 2, letterSpacing: 1 },
});
