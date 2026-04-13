import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function CategoryRatingInput({ label, value, onChange }: Props) {
  const { theme } = useTheme();
  const c = theme.colors;
  const B = theme.border;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <View style={styles.squares}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            style={[
              styles.square,
              {
                borderColor: c.border,
                borderWidth: 2,
                backgroundColor: n <= value ? c.ratingColors[n] : c.inputBg,
              },
            ]}
            onPress={() => {
              lightTap();
              onChange(n === value ? 0 : n);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.squareText, { color: n <= value ? "#000" : c.textSecondary }]}>
              {n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    width: 110,
  },
  squares: {
    flexDirection: "row",
    gap: 6,
  },
  square: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  squareText: {
    fontSize: 14,
    fontWeight: "900",
  },
});
