import { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  percentage: number;
}

const COLUMNS = 52;
const BOX = 4;
const GAP = 1;

const ShareCard = forwardRef<View, Props>(
  ({ weeksLived, weeksRemaining, totalWeeks, percentage }, ref) => {
    const totalYears = Math.ceil(totalWeeks / COLUMNS);

    const rows: { year: number; weeks: { index: number; lived: boolean }[] }[] = [];
    for (let y = 0; y < totalYears; y++) {
      const weeksInYear: { index: number; lived: boolean }[] = [];
      for (let w = 0; w < COLUMNS; w++) {
        const weekIndex = y * COLUMNS + w;
        if (weekIndex >= totalWeeks) break;
        weeksInYear.push({ index: weekIndex, lived: weekIndex < weeksLived });
      }
      if (weeksInYear.length > 0) {
        rows.push({ year: y, weeks: weeksInYear });
      }
    }

    return (
      <View ref={ref} style={styles.card} collapsable={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>WEEKS LEFT</Text>
          </View>
        </View>

        {/* Big number */}
        <View style={styles.numberSection}>
          <Text style={styles.bigNumber}>{weeksRemaining.toLocaleString()}</Text>
          <Text style={styles.weeksLabel}>WEEKS REMAINING</Text>
          <Text style={styles.percentText}>{percentage.toFixed(1)}% OF LIFE LIVED</Text>
        </View>

        {/* Mini grid */}
        <View style={styles.gridContainer}>
          {rows.map((row) => (
            <View key={row.year} style={styles.gridRow}>
              {row.weeks.map((week) => (
                <View
                  key={week.index}
                  style={[
                    styles.gridBox,
                    { backgroundColor: week.lived ? "#000" : "#d4d0ca" },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>WEEKSLEFT.APP</Text>
        </View>
      </View>
    );
  }
);

ShareCard.displayName = "ShareCard";

export default ShareCard;

const styles = StyleSheet.create({
  card: {
    width: 360,
    backgroundColor: "#e8e4de",
    padding: 24,
    borderWidth: 3,
    borderColor: "#000",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleBox: {
    backgroundColor: "#FF6B6B",
    borderWidth: 3,
    borderColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: "-1deg" }],
  },
  titleText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 2,
  },
  numberSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#000",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  bigNumber: {
    fontSize: 52,
    fontWeight: "900",
    color: "#000",
    fontVariant: ["tabular-nums"],
  },
  weeksLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 2,
    marginTop: 4,
  },
  percentText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#666",
    letterSpacing: 1,
    marginTop: 6,
  },
  gridContainer: {
    gap: GAP,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: "row",
    gap: GAP,
  },
  gridBox: {
    width: BOX,
    height: BOX,
  },
  footer: {
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "#000",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 2,
  },
});
