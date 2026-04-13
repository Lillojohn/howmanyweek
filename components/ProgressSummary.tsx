import { View, Text, StyleSheet } from "react-native";

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
  const yearsRemaining = (weeksRemaining / 52.1429).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.bigNumber}>{weeksRemaining.toLocaleString()}</Text>
      <Text style={styles.label}>weeks remaining</Text>
      <Text style={styles.subLabel}>
        ~{yearsRemaining} years (avg. life expectancy: {lifeExpectancy} years)
      </Text>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${Math.min(percentage, 100)}%` }]} />
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{weeksLived.toLocaleString()}</Text>
          <Text style={styles.statLabel}>weeks lived</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{totalWeeks.toLocaleString()}</Text>
          <Text style={styles.statLabel}>total weeks</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{percentage.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>completed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  bigNumber: {
    fontSize: 56,
    fontWeight: "800",
    color: "#1a1a2e",
    fontVariant: ["tabular-nums"],
  },
  label: {
    fontSize: 18,
    color: "#555",
    marginTop: 4,
  },
  subLabel: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
  },
  progressBarContainer: {
    width: "100%",
    height: 12,
    backgroundColor: "#e8e8e8",
    borderRadius: 6,
    marginTop: 24,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4a6cf7",
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
