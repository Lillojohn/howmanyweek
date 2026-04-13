import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  weeksRemaining: number;
  onComplete: () => void;
}

export default function OnboardingAnimation({ weeksRemaining, onComplete }: Props) {
  const { theme } = useTheme();
  const c = theme.colors;
  const B = theme.border;
  const countAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const listenerId = countAnim.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });

    Animated.timing(countAnim, {
      toValue: weeksRemaining,
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(onComplete);
      }, 1200);
    });

    return () => countAnim.removeListener(listenerId);
  }, []);

  return (
    <Animated.View style={[styles.overlay, { backgroundColor: c.background, opacity: fadeAnim }]}>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, borderWidth: B }]}>
        <Text style={[styles.bigNumber, { color: c.text }]}>
          {displayValue.toLocaleString()}
        </Text>
        <Text style={[styles.label, { color: c.text }]}>WEEKS LEFT</Text>
      </View>
      <View style={[styles.subtitleCard, { backgroundColor: c.yellow, borderColor: c.border, borderWidth: B }]}>
        <Text style={styles.subtitle}>MAKE THEM COUNT.</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    gap: 20,
  },
  card: {
    paddingVertical: 48,
    paddingHorizontal: 56,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    transform: [{ rotate: "-0.5deg" }],
  },
  bigNumber: {
    fontSize: 90,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    lineHeight: 96,
  },
  label: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 4,
    marginTop: 8,
  },
  subtitleCard: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    transform: [{ rotate: "0.5deg" }],
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 2,
  },
});
