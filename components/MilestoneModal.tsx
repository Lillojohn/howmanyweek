import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getMilestone, saveMilestone, deleteMilestone } from "../utils/milestones";
import { getWeekDateRange } from "../utils/calculations";
import { lightTap, successTap } from "../utils/haptics";

const EMOJIS = ["🎓", "💼", "💍", "👶", "🏠", "🎂", "✈️", "🏆", "💪", "📖", "🎵", "❤️", "⭐", "🔥", "🌟", "🎯"];
const COLORS = ["#FF6B6B", "#FFD93D", "#A8E6CF", "#C4B5FD", "#87CEEB", "#FFB347", "#FF69B4", "#98FB98"];

interface Props {
  visible: boolean;
  weekIndex: number;
  birthday: Date;
  onClose: () => void;
  onSaved: () => void;
}

export default function MilestoneModal({
  visible,
  weekIndex,
  birthday,
  onClose,
  onSaved,
}: Props) {
  const { theme } = useTheme();
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("⭐");
  const [color, setColor] = useState("#FFD93D");
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);

  const c = theme.colors;
  const B = theme.border;

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getMilestone(weekIndex).then((ms) => {
        if (ms) {
          setLabel(ms.label);
          setEmoji(ms.emoji);
          setColor(ms.color);
          setIsExisting(true);
        } else {
          setLabel("");
          setEmoji("⭐");
          setColor("#FFD93D");
          setIsExisting(false);
        }
        setLoading(false);
      });
    }
  }, [visible, weekIndex]);

  const { start } = getWeekDateRange(weekIndex, birthday);
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleSave = async () => {
    if (!label.trim()) return;
    await saveMilestone(weekIndex, label.trim(), emoji, color);
    successTap();
    onSaved();
    onClose();
  };

  const handleDelete = async () => {
    await deleteMilestone(weekIndex);
    lightTap();
    onSaved();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: c.background, borderColor: c.border, borderWidth: B }]}>
          <View style={[styles.header, { backgroundColor: c.purple, borderBottomColor: c.border, borderBottomWidth: B }]}>
            <Text style={styles.headerTitle}>MILESTONE</Text>
            <Text style={styles.headerDate}>WEEK {weekIndex + 1} — {formatDate(start)}</Text>
          </View>

          {!loading && (
            <ScrollView style={styles.body}>
              <Text style={[styles.fieldLabel, { color: c.text }]}>WHAT HAPPENED?</Text>
              <TextInput
                style={[styles.input, { backgroundColor: c.card, borderColor: c.border, borderWidth: B, color: c.text }]}
                placeholder="Graduated, got married, first job..."
                placeholderTextColor={c.textSecondary}
                value={label}
                onChangeText={setLabel}
                maxLength={50}
              />

              <Text style={[styles.fieldLabel, { color: c.text, marginTop: 14 }]}>PICK AN EMOJI</Text>
              <View style={styles.emojiGrid}>
                {EMOJIS.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={[
                      styles.emojiButton,
                      { borderColor: c.border, borderWidth: 2 },
                      emoji === e && { backgroundColor: c.yellow },
                    ]}
                    onPress={() => { lightTap(); setEmoji(e); }}
                  >
                    <Text style={styles.emojiText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { color: c.text, marginTop: 14 }]}>PICK A COLOR</Text>
              <View style={styles.colorGrid}>
                {COLORS.map((clr) => (
                  <TouchableOpacity
                    key={clr}
                    style={[
                      styles.colorButton,
                      { backgroundColor: clr, borderColor: c.border, borderWidth: 2 },
                      color === clr && { borderWidth: 4 },
                    ]}
                    onPress={() => { lightTap(); setColor(clr); }}
                  />
                ))}
              </View>
            </ScrollView>
          )}

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
              style={[styles.btn, { borderColor: c.border, borderWidth: B, backgroundColor: c.green }, !label.trim() && { opacity: 0.4 }]}
              onPress={handleSave}
              disabled={!label.trim()}
              activeOpacity={0.9}
            >
              <Text style={styles.btnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", paddingHorizontal: 20 },
  card: { shadowColor: "#000", shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6, maxHeight: "80%" },
  header: { paddingVertical: 14, paddingHorizontal: 16, alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#000", letterSpacing: 2 },
  headerDate: { fontSize: 11, fontWeight: "700", color: "#000", marginTop: 4, letterSpacing: 0.5 },
  body: { padding: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 1, marginBottom: 8 },
  input: { padding: 14, fontSize: 15, fontWeight: "700", shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emojiButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  emojiText: { fontSize: 22 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  colorButton: { width: 36, height: 36 },
  buttons: { flexDirection: "row", gap: 8, padding: 12 },
  btn: { flex: 1, paddingVertical: 14, alignItems: "center" },
  btnText: { fontSize: 14, fontWeight: "900", color: "#000", letterSpacing: 1 },
});
