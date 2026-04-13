import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useMemo } from "react";

interface Props {
  weeksLived: number;
  totalWeeks: number;
}

const COLUMNS = 52;
const screenWidth = Dimensions.get("window").width;
const CARD_PADDING = 12;
const OUTER_PADDING = 16;
const LABEL_WIDTH = 20;
const AVAILABLE = screenWidth - OUTER_PADDING * 2 - CARD_PADDING * 2 - LABEL_WIDTH - 4;
const GAP = 1;
const BOX_SIZE = Math.floor((AVAILABLE - GAP * (COLUMNS - 1)) / COLUMNS);

const BORDER = 3;

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
    <View style={styles.wrapper}>
      <View style={styles.titleCard}>
        <Text style={styles.title}>YOUR LIFE IN WEEKS</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.subtitle}>1 SQUARE = 1 WEEK. 1 ROW = 1 YEAR.</Text>
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
            <Text style={styles.legendText}>LIVED</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.boxRemaining]} />
            <Text style={styles.legendText}>REMAINING</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  titleCard: {
    backgroundColor: "#FFD93D",
    borderWidth: BORDER,
    borderColor: "#000",
    borderBottomWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginLeft: 12,
    zIndex: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  container: {
    backgroundColor: "#fff",
    borderWidth: BORDER,
    borderColor: "#000",
    padding: CARD_PADDING,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "#000",
    marginBottom: 10,
    letterSpacing: 0.5,
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
    fontSize: 7,
    fontWeight: "900",
    color: "#000",
    width: LABEL_WIDTH,
    textAlign: "right",
    marginRight: 3,
  },
  yearLabelPlaceholder: {
    width: LABEL_WIDTH,
    marginRight: 3,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
  },
  boxLived: {
    backgroundColor: "#000",
  },
  boxRemaining: {
    backgroundColor: "#e8e4de",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: "#000",
  },
  legendText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
});
