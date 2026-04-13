import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { getSettings, saveSetting } from "../utils/settings";
import { setHapticsEnabled, lightTap } from "../utils/haptics";
import type { Theme } from "../constants/theme";

type ThemeMode = "light" | "dark" | "system";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, mode, setMode } = useTheme();
  const [hapticsOn, setHapticsOn] = useState(true);
  const [notifTone, setNotifTone] = useState<"blunt" | "gentle" | "stoic">("blunt");

  useEffect(() => {
    getSettings().then((s) => {
      setHapticsOn(s.hapticsEnabled);
      setNotifTone(s.notificationTone);
    });
  }, []);

  const s = makeStyles(theme);

  const handleThemeChange = (newMode: ThemeMode) => {
    lightTap();
    setMode(newMode);
  };

  const handleHapticsToggle = () => {
    const newVal = !hapticsOn;
    setHapticsOn(newVal);
    setHapticsEnabled(newVal);
    saveSetting("hapticsEnabled", newVal);
    if (newVal) lightTap();
  };

  const handleToneChange = (tone: "blunt" | "gentle" | "stoic") => {
    lightTap();
    setNotifTone(tone);
    saveSetting("notificationTone", tone);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={s.container}>
        <TouchableOpacity
          style={[s.backButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => router.back()}
          activeOpacity={0.9}
        >
          <Text style={[s.backText, { color: theme.colors.text }]}>BACK</Text>
        </TouchableOpacity>

        <View style={s.titleRow}>
          <View style={[s.titleCard, { backgroundColor: theme.colors.purple, borderColor: theme.colors.border }]}>
            <Text style={[s.titleText, { color: theme.colors.text }]}>SETTINGS</Text>
          </View>
        </View>

        {/* Theme */}
        <View style={s.section}>
          <View style={[s.sectionLabel, { backgroundColor: theme.colors.green, borderColor: theme.colors.border }]}>
            <Text style={s.sectionLabelText}>APPEARANCE</Text>
          </View>
          <View style={[s.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={s.optionRow}>
              {(["system", "light", "dark"] as ThemeMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    s.optionButton,
                    { borderColor: theme.colors.border },
                    mode === m && { backgroundColor: theme.colors.yellow },
                  ]}
                  onPress={() => handleThemeChange(m)}
                  activeOpacity={0.9}
                >
                  <Text style={s.optionText}>{m.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Haptics */}
        <View style={s.section}>
          <View style={[s.sectionLabel, { backgroundColor: theme.colors.green, borderColor: theme.colors.border }]}>
            <Text style={s.sectionLabelText}>HAPTICS</Text>
          </View>
          <TouchableOpacity
            style={[s.sectionCard, s.toggleCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={handleHapticsToggle}
            activeOpacity={0.9}
          >
            <Text style={[s.toggleLabel, { color: theme.colors.text }]}>VIBRATION FEEDBACK</Text>
            <View
              style={[
                s.toggleBadge,
                { borderColor: theme.colors.border },
                hapticsOn
                  ? { backgroundColor: theme.colors.green }
                  : { backgroundColor: theme.colors.red },
              ]}
            >
              <Text style={s.toggleBadgeText}>{hapticsOn ? "ON" : "OFF"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notification Tone */}
        <View style={s.section}>
          <View style={[s.sectionLabel, { backgroundColor: theme.colors.green, borderColor: theme.colors.border }]}>
            <Text style={s.sectionLabelText}>NOTIFICATION TONE</Text>
          </View>
          <View style={[s.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {([
              { key: "blunt" as const, label: "BLUNT", preview: "2,847 weeks left. What will you do with this one?" },
              { key: "gentle" as const, label: "GENTLE", preview: "Good morning. This is week 1,553 of your beautiful life." },
              { key: "stoic" as const, label: "STOIC", preview: "You could leave life right now. Let that determine what you do. — Marcus Aurelius" },
            ]).map((tone) => (
              <TouchableOpacity
                key={tone.key}
                style={[
                  s.toneOption,
                  { borderColor: theme.colors.border },
                  notifTone === tone.key && { backgroundColor: theme.colors.yellow },
                ]}
                onPress={() => handleToneChange(tone.key)}
                activeOpacity={0.9}
              >
                <Text style={s.toneLabel}>{tone.label}</Text>
                <Text style={[s.tonePreview, { color: theme.colors.text }]}>{tone.preview}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(theme: Theme) {
  const B = theme.border;
  const S = theme.shadow;

  return StyleSheet.create({
    safe: { flex: 1 },
    container: { paddingHorizontal: 16, paddingBottom: 40 },
    backButton: {
      borderWidth: B,
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignSelf: "flex-start",
      marginTop: 8,
      marginBottom: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    backText: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
    titleRow: { alignItems: "center", marginBottom: 24 },
    titleCard: {
      borderWidth: B,
      paddingHorizontal: 24,
      paddingVertical: 10,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: S, height: S },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
    },
    titleText: { fontSize: 24, fontWeight: "900", letterSpacing: 2 },
    section: { marginBottom: 20 },
    sectionLabel: {
      borderWidth: B,
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignSelf: "flex-start",
      marginBottom: -B,
      zIndex: 2,
      marginLeft: 12,
    },
    sectionLabelText: { fontSize: 12, fontWeight: "900", color: "#000", letterSpacing: 1 },
    sectionCard: {
      borderWidth: B,
      padding: 12,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    optionRow: { flexDirection: "row", gap: 8 },
    optionButton: {
      flex: 1,
      paddingVertical: 14,
      alignItems: "center",
      borderWidth: B,
      backgroundColor: "transparent",
    },
    optionText: { fontSize: 13, fontWeight: "900", color: "#000", letterSpacing: 1 },
    toggleCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    toggleLabel: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
    toggleBadge: {
      borderWidth: B,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    toggleBadgeText: { fontSize: 13, fontWeight: "900", color: "#000", letterSpacing: 1 },
    toneOption: {
      padding: 12,
      borderBottomWidth: 2,
    },
    toneLabel: { fontSize: 14, fontWeight: "900", color: "#000", letterSpacing: 1, marginBottom: 4 },
    tonePreview: { fontSize: 12, fontWeight: "600", lineHeight: 18, fontStyle: "italic" },
  });
}
