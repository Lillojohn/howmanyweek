import { View, Text, StyleSheet } from "react-native";

interface Props {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  percentage: number;
  lifeExpectancy: number;
}

const BORDER = 3;

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
      <View style={styles.bigNumberCard}>
        <Text style={styles.bigNumber}>{weeksRemaining.toLocaleString()}</Text>
        <Text style={styles.label}>WEEKS REMAINING</Text>
      </View>

      <View style={styles.subCard}>
        <Text style={styles.subLabel}>
          ~{yearsRemaining} YEARS (AVG. LIFE EXPECTANCY: {lifeExpectancy} YRS)
        </Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(percentage, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{percentage.toFixed(1)}% DONE</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#A8E6CF" }]}>
          <Text style={styles.statNumber}>{weeksLived.toLocaleString()}</Text>
          <Text style={styles.statLabel}>LIVED</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FFD93D" }]}>
          <Text style={styles.statNumber}>{totalWeeks.toLocaleString()}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FF6B6B" }]}>
          <Text style={styles.statNumber}>
            {weeksRemaining.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>LEFT</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  bigNumberCard: {
    backgroundColor: "#fff",
    borderWidth: BORDER,
    borderColor: "#000",
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  bigNumber: {
    fontSize: 64,
    fontWeight: "900",
    color: "#000",
    fontVariant: ["tabular-nums"],
  },
  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 2,
    marginTop: 4,
  },
  subCard: {
    backgroundColor: "#C4B5FD",
    borderWidth: BORDER,
    borderColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  progressCard: {
    backgroundColor: "#fff",
    borderWidth: BORDER,
    borderColor: "#000",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  progressBarContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#e8e4de",
    borderWidth: 2,
    borderColor: "#000",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FF6B6B",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderWidth: BORDER,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000",
    marginTop: 2,
    letterSpacing: 1,
  },
});
