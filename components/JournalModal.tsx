import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  getEntry,
  saveEntry,
  deleteEntry,
  emptyRatings,
  CATEGORY_LABELS,
  CATEGORIES,
  type CategoryRatings,
  type Category,
} from "../utils/journal";
import { getWeekDateRange } from "../utils/calculations";
import { lightTap, successTap } from "../utils/haptics";
import CategoryRatingInput from "./CategoryRatingInput";

interface Props {
  visible: boolean;
  weekIndex: number;
  birthday: Date;
  previousIntention?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function JournalModal({
  visible,
  weekIndex,
  birthday,
  previousIntention,
  onClose,
  onSaved,
}: Props) {
  const { theme } = useTheme();
  const [ratings, setRatings] = useState<CategoryRatings>(emptyRatings());
  const [meaningful, setMeaningful] = useState("");
  const [avoiding, setAvoiding] = useState("");
  const [intention, setIntention] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);

  const c = theme.colors;
  const B = theme.border;

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getEntry(weekIndex).then((entry) => {
        if (entry) {
          setRatings(entry.ratings);
          setMeaningful(entry.prompts.meaningful);
          setAvoiding(entry.prompts.avoiding);
          setIntention(entry.prompts.intention);
          setIsExisting(true);
        } else {
          setRatings(emptyRatings());
          setMeaningful("");
          setAvoiding("");
          setIntention("");
          setIsExisting(false);
        }
        setLoading(false);
      });
    }
  }, [visible, weekIndex]);

  const { start, end } = getWeekDateRange(weekIndex, birthday);
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const hasContent =
    Object.values(ratings).some((v) => v > 0) ||
    meaningful.trim() ||
    avoiding.trim() ||
    intention.trim();

  const handleSave = async () => {
    if (!hasContent) return;
    await saveEntry(weekIndex, ratings, {
      meaningful: meaningful.trim(),
      avoiding: avoiding.trim(),
      intention: intention.trim(),
    });
    successTap();
    onSaved();
    onClose();
  };

  const handleDelete = async () => {
    await deleteEntry(weekIndex);
    lightTap();
    onSaved();
    onClose();
  };

  const updateRating = (category: Category, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.card, { backgroundColor: c.background, borderColor: c.border, borderWidth: B }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: c.red, borderBottomColor: c.border, borderBottomWidth: B }]}>
            <Text style={styles.headerTitle}>WEEK {weekIndex + 1}</Text>
            <Text style={styles.headerDate}>
              {formatDate(start)} — {formatDate(end)}
            </Text>
          </View>

          {!loading && (
            <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
              {/* Previous intention reminder */}
              {previousIntention ? (
                <View style={[styles.intentionReminder, { backgroundColor: c.purple, borderColor: c.border, borderWidth: B }]}>
                  <Text style={styles.intentionLabel}>LAST WEEK'S INTENTION</Text>
                  <Text style={styles.intentionText}>{previousIntention}</Text>
                </View>
              ) : null}

              {/* Category ratings */}
              <View style={[styles.ratingsCard, { backgroundColor: c.card, borderColor: c.border, borderWidth: B }]}>
                <Text style={[styles.sectionTitle, { color: c.text }]}>RATE YOUR WEEK</Text>
                {CATEGORIES.map((cat) => (
                  <CategoryRatingInput
                    key={cat}
                    label={CATEGORY_LABELS[cat]}
                    value={ratings[cat]}
                    onChange={(v) => updateRating(cat, v)}
                  />
                ))}
              </View>

              {/* Prompts */}
              <View style={[styles.promptCard, { backgroundColor: c.card, borderColor: c.border, borderWidth: B }]}>
                <Text style={[styles.sectionTitle, { color: c.text }]}>REFLECT</Text>

                <Text style={[styles.promptLabel, { color: c.text }]}>WHAT GAVE THIS WEEK MEANING?</Text>
                <TextInput
                  style={[styles.promptInput, { backgroundColor: c.inputBg, borderColor: c.border, borderWidth: 2, color: c.text }]}
                  placeholder="..."
                  placeholderTextColor={c.textSecondary}
                  value={meaningful}
                  onChangeText={setMeaningful}
                  multiline
                  maxLength={300}
                />

                <Text style={[styles.promptLabel, { color: c.text }]}>WHAT ARE YOU AVOIDING?</Text>
                <TextInput
                  style={[styles.promptInput, { backgroundColor: c.inputBg, borderColor: c.border, borderWidth: 2, color: c.text }]}
                  placeholder="..."
                  placeholderTextColor={c.textSecondary}
                  value={avoiding}
                  onChangeText={setAvoiding}
                  multiline
                  maxLength={300}
                />

                <Text style={[styles.promptLabel, { color: c.text }]}>WHAT'S YOUR INTENTION FOR NEXT WEEK?</Text>
                <TextInput
                  style={[styles.promptInput, { backgroundColor: c.inputBg, borderColor: c.border, borderWidth: 2, color: c.text }]}
                  placeholder="..."
                  placeholderTextColor={c.textSecondary}
                  value={intention}
                  onChangeText={setIntention}
                  multiline
                  maxLength={300}
                />
              </View>
            </ScrollView>
          )}

          {/* Buttons */}
          <View style={[styles.buttons, { borderTopColor: c.border, borderTopWidth: B }]}>
            {isExisting && (
              <TouchableOpacity
                style={[styles.btn, { borderColor: c.border, borderWidth: B, backgroundColor: c.red }]}
                onPress={handleDelete}
                activeOpacity={0.9}
              >
                <Text style={styles.btnText}>DELETE</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btn, { borderColor: c.border, borderWidth: B, backgroundColor: c.card }]}
              onPress={() => { lightTap(); onClose(); }}
              activeOpacity={0.9}
            >
              <Text style={[styles.btnText, { color: c.text }]}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { borderColor: c.border, borderWidth: B, backgroundColor: c.green }, !hasContent && { opacity: 0.4 }]}
              onPress={handleSave}
              disabled={!hasContent}
              activeOpacity={0.9}
            >
              <Text style={styles.btnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", paddingHorizontal: 12 },
  card: { shadowColor: "#000", shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6, maxHeight: "90%" },
  header: { paddingVertical: 12, paddingHorizontal: 16, alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "900", color: "#000", letterSpacing: 2 },
  headerDate: { fontSize: 10, fontWeight: "700", color: "#000", marginTop: 3, letterSpacing: 0.5 },
  body: { paddingHorizontal: 12, paddingVertical: 12 },
  intentionReminder: { padding: 10, marginBottom: 12 },
  intentionLabel: { fontSize: 9, fontWeight: "900", color: "#000", letterSpacing: 0.5, marginBottom: 4 },
  intentionText: { fontSize: 13, fontWeight: "600", color: "#000", fontStyle: "italic", lineHeight: 18 },
  ratingsCard: { padding: 12, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  sectionTitle: { fontSize: 13, fontWeight: "900", letterSpacing: 1, marginBottom: 8 },
  promptCard: { padding: 12, shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  promptLabel: { fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginTop: 10, marginBottom: 6 },
  promptInput: { padding: 10, fontSize: 14, fontWeight: "600", lineHeight: 20, height: 70, textAlignVertical: "top" },
  buttons: { flexDirection: "row", gap: 8, padding: 10 },
  btn: { flex: 1, paddingVertical: 12, alignItems: "center" },
  btnText: { fontSize: 13, fontWeight: "900", color: "#000", letterSpacing: 1 },
});
