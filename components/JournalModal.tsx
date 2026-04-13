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
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getEntry, saveEntry, deleteEntry } from "../utils/journal";
import { getWeekDateRange } from "../utils/calculations";
import { lightTap, successTap } from "../utils/haptics";

interface Props {
  visible: boolean;
  weekIndex: number;
  birthday: Date;
  onClose: () => void;
  onSaved: () => void;
}

export default function JournalModal({
  visible,
  weekIndex,
  birthday,
  onClose,
  onSaved,
}: Props) {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);

  const c = theme.colors;
  const B = theme.border;

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getEntry(weekIndex).then((entry) => {
        setText(entry?.text ?? "");
        setIsExisting(!!entry);
        setLoading(false);
      });
    }
  }, [visible, weekIndex]);

  const { start, end } = getWeekDateRange(weekIndex, birthday);
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleSave = async () => {
    if (!text.trim()) return;
    await saveEntry(weekIndex, text.trim());
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

          {/* Input */}
          {!loading && (
            <View style={styles.body}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: c.card,
                    borderColor: c.border,
                    borderWidth: B,
                    color: c.text,
                  },
                ]}
                placeholder="What did you do with this week?"
                placeholderTextColor={c.textSecondary}
                value={text}
                onChangeText={setText}
                multiline
                maxLength={500}
                textAlignVertical="top"
                autoFocus
              />
              <Text style={[styles.charCount, { color: c.textSecondary }]}>
                {text.length}/500
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View style={[styles.buttons, { borderTopColor: c.border, borderTopWidth: B }]}>
            {isExisting && (
              <TouchableOpacity
                style={[styles.deleteButton, { borderColor: c.border, borderWidth: B, backgroundColor: c.red }]}
                onPress={handleDelete}
                activeOpacity={0.9}
              >
                <Text style={styles.buttonText}>DELETE</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: c.border, borderWidth: B, backgroundColor: c.card }]}
              onPress={() => { lightTap(); onClose(); }}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, { color: c.text }]}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { borderColor: c.border, borderWidth: B, backgroundColor: c.green },
                !text.trim() && { opacity: 0.4 },
              ]}
              onPress={handleSave}
              disabled={!text.trim()}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 2,
  },
  headerDate: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  body: {
    padding: 16,
  },
  input: {
    height: 140,
    padding: 14,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  charCount: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 6,
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
});
