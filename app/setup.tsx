import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { getCountries } from "../utils/calculations";
import { saveUserData } from "../utils/storage";
import { requestPermissions, scheduleWeeklyNotification } from "../utils/notifications";
import { useTheme } from "../contexts/ThemeContext";
import { lightTap, successTap } from "../utils/haptics";
import { updateWidget } from "../utils/widget";

const countries = getCountries();

export default function SetupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [birthday, setBirthday] = useState(new Date(1990, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(1990, 0, 1));
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countries;
    const query = countrySearch.toLowerCase();
    return countries.filter((c) => c.toLowerCase().includes(query));
  }, [countrySearch]);

  const onDateChange = (date: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      setBirthday(date);
    } else {
      setTempDate(date);
    }
  };

  const canCalculate = country !== "";

  const handleStart = async () => {
    if (!canCalculate) return;

    const data = {
      birthday: birthday.toISOString(),
      country,
      gender,
    };

    await saveUserData(data);
    successTap();

    const granted = await requestPermissions();
    if (granted) {
      await scheduleWeeklyNotification(data.birthday, data.country, data.gender);
    }

    updateWidget();
    router.replace("/home");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.titleCard}>
              <Text style={styles.title}>WEEKS{"\n"}LEFT</Text>
            </View>
            <Text style={styles.subtitle}>
              SEE HOW MANY WEEKS YOU HAVE LEFT.{"\n"}GET A WEEKLY REMINDER TO MAKE THEM COUNT.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Birthday */}
            <View style={styles.field}>
              <View style={styles.labelCard}>
                <Text style={styles.fieldLabel}>BIRTHDAY</Text>
              </View>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => {
                  setTempDate(birthday);
                  setShowDatePicker(true);
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.inputText}>{formatDate(birthday)}</Text>
              </TouchableOpacity>
            </View>

            {/* Date Picker Modal */}
            <Modal visible={showDatePicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <View style={styles.modalTitleCard}>
                    <Text style={styles.modalTitleText}>PICK YOUR BIRTHDAY</Text>
                  </View>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    onValueChange={onDateChange}
                    style={styles.spinnerPicker}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={() => setShowDatePicker(false)}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.modalButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalConfirmButton}
                      onPress={() => {
                        setBirthday(tempDate);
                        setShowDatePicker(false);
                      }}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.modalButtonText}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Country */}
            <View style={[styles.field, { zIndex: 10 }]}>
              <View style={styles.labelCard}>
                <Text style={styles.fieldLabel}>COUNTRY</Text>
              </View>
              <TextInput
                style={[styles.inputBox, styles.textInput]}
                placeholder="TYPE TO SEARCH..."
                placeholderTextColor="#999"
                value={showCountryList ? countrySearch : country || countrySearch}
                onFocus={() => {
                  setShowCountryList(true);
                  setCountrySearch("");
                }}
                onChangeText={(text) => {
                  setCountrySearch(text);
                  setCountry("");
                  setShowCountryList(true);
                }}
              />
              {showCountryList && (
                <View style={styles.countryList}>
                  <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item}
                    keyboardShouldPersistTaps="handled"
                    style={styles.countryFlatList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.countryItem,
                          item === country && styles.countryItemActive,
                        ]}
                        onPress={() => {
                          setCountry(item);
                          setCountrySearch(item);
                          setShowCountryList(false);
                          Keyboard.dismiss();
                        }}
                      >
                        <Text
                          style={[
                            styles.countryItemText,
                            item === country && styles.countryItemTextActive,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

            {/* Gender */}
            <View style={styles.field}>
              <View style={styles.labelCard}>
                <Text style={styles.fieldLabel}>GENDER</Text>
              </View>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "male" && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender("male")}
                >
                  <Text style={styles.genderButtonText}>MALE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === "female" && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender("female")}
                >
                  <Text style={styles.genderButtonText}>FEMALE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startButton, !canCalculate && styles.startButtonDisabled]}
            onPress={handleStart}
            disabled={!canCalculate}
            activeOpacity={0.9}
          >
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BORDER = 3;
const SHADOW = 5;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#e8e4de" },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingVertical: 24,
  },
  header: { alignItems: "center", marginBottom: 32 },
  titleCard: {
    backgroundColor: "#FF6B6B",
    borderWidth: BORDER,
    borderColor: "#000",
    paddingHorizontal: 28,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: SHADOW, height: SHADOW },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    transform: [{ rotate: "-1deg" }],
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  form: { gap: 20, marginBottom: 28 },
  field: {},
  labelCard: {
    backgroundColor: "#A8E6CF",
    borderWidth: BORDER,
    borderColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: -BORDER,
    zIndex: 2,
    marginLeft: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderWidth: BORDER,
    borderColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  textInput: { fontSize: 16, fontWeight: "700", color: "#000" },
  inputText: { fontSize: 16, fontWeight: "700", color: "#000" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#e8e4de",
    borderWidth: BORDER,
    borderColor: "#000",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  modalTitleCard: {
    backgroundColor: "#FF6B6B",
    borderBottomWidth: BORDER,
    borderBottomColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  spinnerPicker: { height: 180, backgroundColor: "#fff" },
  modalButtons: {
    flexDirection: "row",
    borderTopWidth: BORDER,
    borderTopColor: "#000",
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRightWidth: BORDER / 2,
    borderRightColor: "#000",
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#A8E6CF",
    borderLeftWidth: BORDER / 2,
    borderLeftColor: "#000",
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  countryList: {
    backgroundColor: "#fff",
    borderWidth: BORDER,
    borderColor: "#000",
    borderTopWidth: 0,
    maxHeight: 180,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  countryFlatList: { maxHeight: 180 },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e8e4de",
  },
  countryItemActive: { backgroundColor: "#FFD93D" },
  countryItemText: { fontSize: 15, fontWeight: "700", color: "#000" },
  countryItemTextActive: { color: "#000" },
  genderRow: { flexDirection: "row", gap: 12 },
  genderButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: BORDER,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  genderButtonActive: {
    backgroundColor: "#FFD93D",
    shadowOffset: { width: 2, height: 2 },
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  startButton: {
    backgroundColor: "#000",
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: BORDER,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: SHADOW, height: SHADOW },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: "#bbb",
    shadowOffset: { width: 2, height: 2 },
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
  },
});
