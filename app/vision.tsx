import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { getVision, saveVision } from "../utils/vision";
import { lightTap, successTap } from "../utils/haptics";
import type { Theme } from "../constants/theme";

export default function VisionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [idealFuture, setIdealFuture] = useState("");
  const [worstFuture, setWorstFuture] = useState("");
  const [loaded, setLoaded] = useState(false);

  const c = theme.colors;
  const s = makeStyles(theme);

  useEffect(() => {
    getVision().then((v) => {
      if (v) {
        setIdealFuture(v.idealFuture);
        setWorstFuture(v.worstFuture);
      }
      setLoaded(true);
    });
  }, []);

  const handleSave = async () => {
    await saveVision(idealFuture.trim(), worstFuture.trim());
    successTap();
    router.back();
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={[s.backButton, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={() => { lightTap(); router.back(); }}
            activeOpacity={0.9}
          >
            <Text style={[s.backText, { color: c.text }]}>BACK</Text>
          </TouchableOpacity>

          <View style={s.headerRow}>
            <View style={[s.titleCard, { backgroundColor: c.purple, borderColor: c.border }]}>
              <Text style={s.titleText}>MY VISION</Text>
            </View>
          </View>

          <Text style={[s.intro, { color: c.text }]}>
            Write about the future you want — and the one you'll get if you change nothing. Revisit this when you do your weekly review.
          </Text>

          {/* Ideal future */}
          <View style={[s.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[s.cardLabel, { backgroundColor: c.green, borderColor: c.border }]}>
              <Text style={s.cardLabelText}>IDEAL FUTURE</Text>
            </View>
            <Text style={[s.prompt, { color: c.textSecondary }]}>
              Describe your life 3 years from now if everything goes right. Be specific.
            </Text>
            <TextInput
              style={[s.textArea, { backgroundColor: c.inputBg, borderColor: c.border, color: c.text }]}
              placeholder="I wake up every morning feeling..."
              placeholderTextColor={c.textSecondary}
              value={idealFuture}
              onChangeText={setIdealFuture}
              multiline
              maxLength={1000}
              textAlignVertical="top"
            />
          </View>

          {/* Worst future */}
          <View style={[s.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[s.cardLabel, { backgroundColor: c.red, borderColor: c.border }]}>
              <Text style={s.cardLabelText}>IF NOTHING CHANGES</Text>
            </View>
            <Text style={[s.prompt, { color: c.textSecondary }]}>
              Describe your life 3 years from now if you keep doing exactly what you're doing. Be honest.
            </Text>
            <TextInput
              style={[s.textArea, { backgroundColor: c.inputBg, borderColor: c.border, color: c.text }]}
              placeholder="If I keep going like this, I'll probably..."
              placeholderTextColor={c.textSecondary}
              value={worstFuture}
              onChangeText={setWorstFuture}
              multiline
              maxLength={1000}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[s.saveButton, { backgroundColor: c.buttonBg, borderColor: c.border }]}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <Text style={[s.saveText, { color: c.buttonText }]}>SAVE</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(theme: Theme) {
  const B = theme.border;
  const S = theme.shadow;

  return StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingHorizontal: 16, paddingBottom: 40 },
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
    headerRow: { alignItems: "center", marginBottom: 16 },
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
    titleText: { fontSize: 22, fontWeight: "900", color: "#000", letterSpacing: 2 },
    intro: { fontSize: 13, fontWeight: "600", lineHeight: 20, marginBottom: 20, textAlign: "center" },
    card: {
      borderWidth: B,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    cardLabel: {
      borderWidth: B,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf: "flex-start",
      marginBottom: 10,
    },
    cardLabelText: { fontSize: 11, fontWeight: "900", color: "#000", letterSpacing: 1 },
    prompt: { fontSize: 12, fontWeight: "600", lineHeight: 18, marginBottom: 10 },
    textArea: {
      borderWidth: 2,
      padding: 12,
      fontSize: 14,
      fontWeight: "600",
      lineHeight: 22,
      height: 150,
    },
    saveButton: {
      borderWidth: B,
      paddingVertical: 18,
      alignItems: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: S, height: S },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
    },
    saveText: { fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  });
}
