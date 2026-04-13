import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useMemo, useCallback, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";

interface Props {
  weeksLived: number;
  totalWeeks: number;
  journaledWeeks: Set<number>;
  onWeekPress: (weekIndex: number) => void;
}

const COLUMNS = 52;
const screenWidth = Dimensions.get("window").width;
const CARD_PADDING = 12;
const OUTER_PADDING = 16;
const LABEL_WIDTH = 20;
const LABEL_MARGIN = 3;
const AVAILABLE = screenWidth - OUTER_PADDING * 2 - CARD_PADDING * 2 - LABEL_WIDTH - LABEL_MARGIN;
const GAP = 1;
const BOX_SIZE = Math.floor((AVAILABLE - GAP * (COLUMNS - 1)) / COLUMNS);

export default function WeekGridInteractive({
  weeksLived,
  totalWeeks,
  journaledWeeks,
  onWeekPress,
}: Props) {
  const { theme } = useTheme();
  const c = theme.colors;
  const B = theme.border;
  const S = theme.shadow;
  const gridRef = useRef<View>(null);

  const totalYears = Math.ceil(totalWeeks / COLUMNS);
  const labelInterval = 10;

  const rows = useMemo(() => {
    const result: { year: number; weeks: { index: number; lived: boolean; journaled: boolean }[] }[] = [];
    for (let y = 0; y < totalYears; y++) {
      const weeksInYear: { index: number; lived: boolean; journaled: boolean }[] = [];
      for (let w = 0; w < COLUMNS; w++) {
        const weekIndex = y * COLUMNS + w;
        if (weekIndex >= totalWeeks) break;
        weeksInYear.push({
          index: weekIndex,
          lived: weekIndex < weeksLived,
          journaled: journaledWeeks.has(weekIndex),
        });
      }
      if (weeksInYear.length > 0) {
        result.push({ year: y, weeks: weeksInYear });
      }
    }
    return result;
  }, [weeksLived, totalWeeks, totalYears, journaledWeeks]);

  const handlePress = useCallback(
    (e: { nativeEvent: { locationX: number; locationY: number } }) => {
      const { locationX, locationY } = e.nativeEvent;

      // Account for label column
      const gridX = locationX - LABEL_WIDTH - LABEL_MARGIN;
      if (gridX < 0) return;

      const col = Math.floor(gridX / (BOX_SIZE + GAP));
      const row = Math.floor(locationY / (BOX_SIZE + GAP));

      if (col < 0 || col >= COLUMNS || row < 0 || row >= totalYears) return;

      const weekIndex = row * COLUMNS + col;
      if (weekIndex >= totalWeeks) return;

      // Only allow tapping lived weeks
      if (weekIndex < weeksLived) {
        lightTap();
        onWeekPress(weekIndex);
      }
    },
    [weeksLived, totalWeeks, totalYears, onWeekPress]
  );

  const getBoxColor = (week: { lived: boolean; journaled: boolean }) => {
    if (week.journaled) return c.green;
    if (week.lived) return c.gridLived;
    return c.gridRemaining;
  };

  return (
    <View style={{ marginTop: 12 }}>
      <View style={[styles.titleTab, { backgroundColor: c.yellow, borderColor: c.border, borderWidth: B }]}>
        <Text style={styles.titleText}>YOUR LIFE IN WEEKS</Text>
      </View>

      <View style={[styles.container, { backgroundColor: c.card, borderColor: c.border, borderWidth: B, shadowColor: c.shadow, shadowOffset: { width: S, height: S } }]}>
        <Text style={[styles.subtitle, { color: c.text }]}>TAP A LIVED WEEK TO JOURNAL IT.</Text>

        <Pressable onPress={handlePress} ref={gridRef}>
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
                    style={[styles.box, { backgroundColor: getBoxColor(week) }]}
                  />
                ))}
              </View>
            ))}
          </View>
        </Pressable>

        <View style={[styles.legend, { borderTopColor: c.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: c.gridLived, borderColor: c.border }]} />
            <Text style={[styles.legendText, { color: c.text }]}>LIVED</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: c.green, borderColor: c.border }]} />
            <Text style={[styles.legendText, { color: c.text }]}>JOURNALED</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: c.gridRemaining, borderColor: c.border }]} />
            <Text style={[styles.legendText, { color: c.text }]}>LEFT</Text>
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
  yearLabel: { fontSize: 7, fontWeight: "900", width: LABEL_WIDTH, textAlign: "right", marginRight: LABEL_MARGIN },
  yearPlaceholder: { width: LABEL_WIDTH, marginRight: LABEL_MARGIN },
  box: { width: BOX_SIZE, height: BOX_SIZE },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 2,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendBox: { width: 12, height: 12, borderWidth: 2 },
  legendText: { fontSize: 9, fontWeight: "900", letterSpacing: 0.5 },
});
