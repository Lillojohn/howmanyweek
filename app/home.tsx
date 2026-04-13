import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getUserData, UserData } from "../utils/storage";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap } from "../utils/haptics";
import { getEntry } from "../utils/journal";
import JournalModal from "../components/JournalModal";
import type { Theme } from "../constants/theme";
import {
  getWeeksLived,
  getWeeksRemaining,
  getTotalWeeks,
  getPercentageLived,
  getLifeExpectancy,
} from "../utils/calculations";

const QUOTES = [
  "What will you do with this week?",
  "Make this one count.",
  "Not infinite. Not zero. Go.",
  "The best week of your life could be this one.",
  "What's the one thing that matters today?",
  "You're still here. That's the start.",
  "Another week. Another chance.",
  "Don't count the days. Make the days count.",
  "This week is a gift. Use it.",
  "Your time is limited. Don't waste it.",
];

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [data, setData] = useState<UserData | null>(null);
  const [quote, setQuote] = useState("");
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [journalModalVisible, setJournalModalVisible] = useState(false);
  const [lastWeekIndex, setLastWeekIndex] = useState(0);

  useEffect(() => {
    getUserData().then((d) => {
      if (!d) {
        router.replace("/setup");
        return;
      }
      setData(d);

      // Check if last week has a journal entry
      const bday = new Date(d.birthday);
      const currentWeek = getWeeksLived(bday);
      const prevWeek = currentWeek - 1;
      setLastWeekIndex(prevWeek);
      if (prevWeek >= 0) {
        getEntry(prevWeek).then((entry) => {
          setShowJournalPrompt(!entry);
        });
      }
    });
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!data) return null;

  const birthday = new Date(data.birthday);
  const weeksRemaining = getWeeksRemaining(birthday, data.country, data.gender);
  const weeksLived = getWeeksLived(birthday);
  const totalWeeks = getTotalWeeks(data.country, data.gender);
  const percentage = getPercentageLived(birthday, data.country, data.gender);

  const s = makeStyles(theme);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.colors.background }]}>
      <View style={s.container}>
        <View style={s.topBar}>
          <TouchableOpacity
            style={[s.topButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => { lightTap(); router.push("/settings"); }}
          >
            <Text style={[s.topButtonText, { color: theme.colors.text }]}>SETTINGS</Text>
          </TouchableOpacity>
        </View>

        <View style={s.center}>
          <View style={[s.weekCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[s.bigNumber, { color: theme.colors.text }]}>
              {weeksRemaining.toLocaleString()}
            </Text>
            <Text style={[s.weeksLabel, { color: theme.colors.text }]}>WEEKS LEFT</Text>
          </View>

          <View style={[s.quoteCard, { backgroundColor: theme.colors.yellow, borderColor: theme.colors.border }]}>
            <Text style={s.quoteText}>{quote}</Text>
          </View>

          {showJournalPrompt && (
            <TouchableOpacity
              style={[s.promptCard, { backgroundColor: theme.colors.red, borderColor: theme.colors.border }]}
              onPress={() => { lightTap(); setJournalModalVisible(true); }}
              activeOpacity={0.9}
            >
              <Text style={s.promptText}>WHAT DID YOU DO WITH LAST WEEK?</Text>
              <Text style={s.promptSub}>TAP TO WRITE IT DOWN</Text>
            </TouchableOpacity>
          )}

          <View style={s.miniStats}>
            <Text style={[s.miniStatText, { color: theme.colors.text }]}>
              WEEK {weeksLived.toLocaleString()} OF {totalWeeks.toLocaleString()}
            </Text>
            <View style={[s.miniProgressBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View
                style={[s.miniProgressFill, { backgroundColor: theme.colors.progressFill, width: `${Math.min(percentage, 100)}%` }]}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[s.detailsButton, { backgroundColor: theme.colors.buttonBg, borderColor: theme.colors.border }]}
          onPress={() => {
            lightTap();
            router.push({
              pathname: "/details",
              params: { birthday: data.birthday, country: data.country, gender: data.gender },
            });
          }}
          activeOpacity={0.9}
        >
          <Text style={[s.detailsButtonText, { color: theme.colors.buttonText }]}>SEE ALL DATA</Text>
        </TouchableOpacity>
      </View>

      {data && (
        <JournalModal
          visible={journalModalVisible}
          weekIndex={lastWeekIndex}
          birthday={new Date(data.birthday)}
          onClose={() => setJournalModalVisible(false)}
          onSaved={() => setShowJournalPrompt(false)}
        />
      )}
    </SafeAreaView>
  );
}

function makeStyles(theme: Theme) {
  const B = theme.border;
  const S = theme.shadow;

  return StyleSheet.create({
    safe: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 20, paddingVertical: 12, justifyContent: "space-between" },
    topBar: { flexDirection: "row", justifyContent: "flex-end" },
    topButton: {
      borderWidth: B,
      paddingHorizontal: 14,
      paddingVertical: 8,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
    },
    topButtonText: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
    center: { alignItems: "center", gap: 16 },
    promptCard: {
      borderWidth: B,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: "center",
      width: "100%",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
      transform: [{ rotate: "-0.3deg" }],
    },
    promptText: { fontSize: 14, fontWeight: "900", color: "#000", letterSpacing: 0.5, textAlign: "center" },
    promptSub: { fontSize: 10, fontWeight: "700", color: "#000", marginTop: 4, letterSpacing: 1 },
    weekCard: {
      borderWidth: B,
      paddingVertical: 40,
      paddingHorizontal: 48,
      alignItems: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: S, height: S },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
      transform: [{ rotate: "-0.5deg" }],
    },
    bigNumber: { fontSize: 80, fontWeight: "900", fontVariant: ["tabular-nums"], lineHeight: 88 },
    weeksLabel: { fontSize: 20, fontWeight: "900", letterSpacing: 4, marginTop: 4 },
    quoteCard: {
      borderWidth: B,
      paddingVertical: 14,
      paddingHorizontal: 20,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
      transform: [{ rotate: "0.5deg" }],
    },
    quoteText: { fontSize: 16, fontWeight: "800", color: "#000", textAlign: "center", lineHeight: 22 },
    miniStats: { alignItems: "center", gap: 8, width: "100%" },
    miniStatText: { fontSize: 12, fontWeight: "900", letterSpacing: 1 },
    miniProgressBar: {
      width: "80%",
      height: 12,
      borderWidth: 2,
      overflow: "hidden",
    },
    miniProgressFill: { height: "100%" },
    detailsButton: {
      borderWidth: B,
      paddingVertical: 18,
      alignItems: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: S, height: S },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
    },
    detailsButtonText: { fontSize: 16, fontWeight: "900", letterSpacing: 2 },
  });
}
