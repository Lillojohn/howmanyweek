import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useMemo } from "react";

interface Props {
  weeksLived: number;
  totalWeeks: number;
}

const COLUMNS = 52; // 52 weeks per year
const screenWidth = Dimensions.get("window").width;
const PADDING = 20;
const GAP = 1;
const BOX_SIZE = Math.floor((screenWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

export default function WeekGrid({ weeksLived, totalWeeks }: Props) {
  const totalYears = Math.ceil(totalWeeks / COLUMNS);

  const rows = useMemo(() => {
    const result: { year: number; weeks: { index: number; lived: boolean }[] }[] = [];
    for (let y = 0; y < totalYears; y++) {
      const weeksInYear: { index: number; lived: boolean }[] = [];
      for (let w = 0; w < COLUMNS; w++) {
        const weekIndex = y * COLUMNS + w;
        if (weekIndex >= totalWeeks) break;
        weeksInYear.push({
          index: weekIndex,
          lived: weekIndex < weeksLived,
        });
      }
      if (weeksInYear.length > 0) {
        result.push({ year: y, weeks: weeksInYear });
      }
    }
    return result;
  }, [weeksLived, totalWeeks, totalYears]);

  const labelInterval = 10;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your life in weeks</Text>
      <Text style={styles.subtitle}>Each square = 1 week. Each row = 1 year.</Text>
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row.year} style={styles.row}>
            {row.year % labelInterval === 0 ? (
              <Text style={styles.yearLabel}>{row.year}</Text>
            ) : (
              <View style={styles.yearLabelPlaceholder} />
            )}
            {row.weeks.map((week) => (
              <View
                key={week.index}
                style={[
                  styles.box,
                  week.lived ? styles.boxLived : styles.boxRemaining,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.boxLived]} />
          <Text style={styles.legendText}>Weeks lived</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.boxRemaining]} />
          <Text style={styles.legendText}>Weeks remaining</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
  },
  grid: {
    gap: GAP,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
    alignItems: "center",
  },
  yearLabel: {
    fontSize: 8,
    color: "#aaa",
    width: 18,
    textAlign: "right",
    marginRight: 2,
  },
  yearLabelPlaceholder: {
    width: 18,
    marginRight: 2,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 1,
  },
  boxLived: {
    backgroundColor: "#4a6cf7",
  },
  boxRemaining: {
    backgroundColor: "#e8e8ee",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
});
