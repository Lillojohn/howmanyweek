import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "../utils/journal";

interface Props {
  activeFilter: Category | null;
  onFilterChange: (category: Category | null) => void;
}

export default function CategoryFilter({ activeFilter, onFilterChange }: Props) {
  const { theme } = useTheme();
  const c = theme.colors;
  const B = theme.border;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.chip,
            { borderColor: c.border, borderWidth: 2 },
            activeFilter === null && { backgroundColor: c.yellow },
          ]}
          onPress={() => { lightTap(); onFilterChange(null); }}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>ALL</Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              { borderColor: c.border, borderWidth: 2 },
              activeFilter === cat && { backgroundColor: c.yellow },
            ]}
            onPress={() => {
              lightTap();
              onFilterChange(activeFilter === cat ? null : cat);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.chipText}>{CATEGORY_LABELS[cat]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 8 },
  container: { flexDirection: "row", gap: 6, paddingHorizontal: 2 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 0.5,
  },
});
