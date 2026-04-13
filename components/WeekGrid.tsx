import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";

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

export default function WeekGrid({ weeksLived, totalWeeks }: Props) {
  const { theme } = useTheme();
  const totalYears = Math.ceil(totalWeeks / COLUMNS);
  const c = theme.colors;
  const B = theme.border;
  const S = theme.shadow;

  const rows = useMemo(() => {
    const result: { year: number; weeks: { index: number; lived: boolean }[] }[] = [];
    for (let y = 0; y < totalYears; y++) {
      const weeksInYear: { index: number; lived: boolean }[] = [];
      for (let w = 0; w < COLUMNS; w++) {
        const weekIndex = y * COLUMNS + w;
        if (weekIndex >= totalWeeks) break;
        weeksInYear.push({ index: weekIndex, lived: weekIndex < weeksLived });
      }
      if (weeksInYear.length > 0) {
        result.push({ year: y, weeks: weeksInYear });
      }
    }
    return result;
  }, [weeksLived, totalWeeks, totalYears]);

  const labelInterval = 10;

  return (
    <View style={{ marginTop: 12 }}>
      <View style={[styles.titleTab, { backgroundColor: c.yellow, borderColor: c.border, borderWidth: B }]}>
        <Text style={styles.titleText}>YOUR LIFE IN WEEKS</Text>
      </View>

      <View style={[styles.container, { backgroundColor: c.card, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: S, height: S } }]}>
        <Text style={[styles.subtitle, { color: c.text }]}>1 SQUARE = 1 WEEK. 1 ROW = 1 YEAR.</Text>
        <View style={{ gap: GAP }}>
          {rows.map((row) => (
            <View key={row.year} style={styles.row}>
              {row.year % labelInterval === 0 ? (
                <Text style={[styles.yearLabel, { color: c.text }]}>{row.year}</Text>
              ) : (
                <View style={styles.yearPlaceholder} />
              )}
              {row.weeks.map((week) => (
                <View
                  key={week.index}
                  style={[
                    styles.box,
                    { backgroundColor: week.lived ? c.gridLived : c.gridRemaining },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={[styles.legend, { borderTopColor: c.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: c.gridLived, borderColor: c.border }]} />
            <Text style={[styles.legendText, { color: c.text }]}>LIVED</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: c.gridRemaining, borderColor: c.border }]} />
            <Text style={[styles.legendText, { color: c.text }]}>REMAINING</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleTab: {
    borderBottomWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginLeft: 12,
    zIndex: 2,
  },
  titleText: { fontSize: 14, fontWeight: "900", color: "#000", letterSpacing: 1 },
  container: {
    padding: CARD_PADDING,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  subtitle: { fontSize: 9, fontWeight: "800", marginBottom: 10, letterSpacing: 0.5 },
  row: { flexDirection: "row", gap: GAP, alignItems: "center" },
  yearLabel: { fontSize: 7, fontWeight: "900", width: LABEL_WIDTH, textAlign: "right", marginRight: 3 },
  yearPlaceholder: { width: LABEL_WIDTH, marginRight: 3 },
  box: { width: BOX_SIZE, height: BOX_SIZE },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 2,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendBox: { width: 14, height: 14, borderWidth: 2 },
  legendText: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
});
