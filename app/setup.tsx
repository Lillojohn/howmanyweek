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
import type { Theme } from "../constants/theme";

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

  const c = theme.colors;
  const s = makeStyles(theme);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.header}>
            <View style={[s.titleCard, { backgroundColor: c.red, borderColor: c.border }]}>
              <Text style={[s.title, { color: c.text }]}>WEEKS{"\n"}LEFT</Text>
            </View>
            <Text style={[s.subtitle, { color: c.text }]}>
              SEE HOW MANY WEEKS YOU HAVE LEFT.{"\n"}GET A WEEKLY REMINDER TO MAKE THEM COUNT.
            </Text>
          </View>

          <View style={s.form}>
            {/* Birthday */}
            <View style={s.field}>
              <View style={[s.labelCard, { backgroundColor: c.green, borderColor: c.border }]}>
                <Text style={s.fieldLabel}>BIRTHDAY</Text>
              </View>
              <TouchableOpacity
                style={[s.inputBox, { backgroundColor: c.inputBg, borderColor: c.border }]}
                onPress={() => {
                  setTempDate(birthday);
                  setShowDatePicker(true);
                }}
                activeOpacity={0.9}
              >
                <Text style={[s.inputText, { color: c.text }]}>{formatDate(birthday)}</Text>
              </TouchableOpacity>
            </View>

            {/* Date Picker Modal */}
            <Modal visible={showDatePicker} transparent animationType="slide">
              <View style={s.modalOverlay}>
                <View style={[s.modalCard, { backgroundColor: c.background, borderColor: c.border }]}>
                  <View style={[s.modalTitleCard, { backgroundColor: c.red, borderBottomColor: c.border }]}>
                    <Text style={s.modalTitleText}>PICK YOUR BIRTHDAY</Text>
                  </View>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    onValueChange={onDateChange}
                    style={[s.spinnerPicker, { backgroundColor: c.card }]}
                  />
                  <View style={[s.modalButtons, { borderTopColor: c.border }]}>
                    <TouchableOpacity
                      style={[s.modalCancelButton, { backgroundColor: c.card, borderRightColor: c.border }]}
                      onPress={() => setShowDatePicker(false)}
                      activeOpacity={0.9}
                    >
                      <Text style={[s.modalButtonText, { color: c.text }]}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.modalConfirmButton, { backgroundColor: c.green, borderLeftColor: c.border }]}
                      onPress={() => {
                        setBirthday(tempDate);
                        setShowDatePicker(false);
                      }}
                      activeOpacity={0.9}
                    >
                      <Text style={s.modalButtonText}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Country */}
            <View style={[s.field, { zIndex: 10 }]}>
              <View style={[s.labelCard, { backgroundColor: c.green, borderColor: c.border }]}>
                <Text style={s.fieldLabel}>COUNTRY</Text>
              </View>
              <TextInput
                style={[s.inputBox, s.textInput, { backgroundColor: c.inputBg, borderColor: c.border, color: c.text }]}
                placeholder="TYPE TO SEARCH..."
                placeholderTextColor={c.textSecondary}
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
                <View style={[s.countryList, { backgroundColor: c.card, borderColor: c.border }]}>
                  <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item}
                    keyboardShouldPersistTaps="handled"
                    style={s.countryFlatList}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          s.countryItem,
                          { borderBottomColor: c.background },
                          item === country && { backgroundColor: c.yellow },
                        ]}
                        onPress={() => {
                          setCountry(item);
                          setCountrySearch(item);
                          setShowCountryList(false);
                          Keyboard.dismiss();
                        }}
                      >
                        <Text style={[s.countryItemText, { color: c.text }]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

            {/* Gender */}
            <View style={s.field}>
              <View style={[s.labelCard, { backgroundColor: c.green, borderColor: c.border }]}>
                <Text style={s.fieldLabel}>GENDER</Text>
              </View>
              <View style={s.genderRow}>
                <TouchableOpacity
                  style={[
                    s.genderButton,
                    { backgroundColor: c.inputBg, borderColor: c.border },
                    gender === "male" && { backgroundColor: c.yellow, shadowOffset: { width: 2, height: 2 }, transform: [{ translateX: 2 }, { translateY: 2 }] },
                  ]}
                  onPress={() => setGender("male")}
                >
                  <Text style={[s.genderButtonText, { color: c.text }]}>MALE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    s.genderButton,
                    { backgroundColor: c.inputBg, borderColor: c.border },
                    gender === "female" && { backgroundColor: c.yellow, shadowOffset: { width: 2, height: 2 }, transform: [{ translateX: 2 }, { translateY: 2 }] },
                  ]}
                  onPress={() => setGender("female")}
                >
                  <Text style={[s.genderButtonText, { color: c.text }]}>FEMALE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[s.startButton, { backgroundColor: c.buttonBg, borderColor: c.border }, !canCalculate && { backgroundColor: c.buttonDisabled, shadowOffset: { width: 2, height: 2 } }]}
            onPress={handleStart}
            disabled={!canCalculate}
            activeOpacity={0.9}
          >
            <Text style={[s.startButtonText, { color: c.buttonText }]}>START</Text>
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
    container: { flexGrow: 1, paddingHorizontal: 20, justifyContent: "center", paddingVertical: 24 },
    header: { alignItems: "center", marginBottom: 32 },
    titleCard: {
      borderWidth: B,
      paddingHorizontal: 28,
      paddingVertical: 14,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: S, height: S },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
      transform: [{ rotate: "-1deg" }],
    },
    title: { fontSize: 40, fontWeight: "900", textAlign: "center", lineHeight: 44 },
    subtitle: { fontSize: 11, fontWeight: "700", marginTop: 16, textAlign: "center", letterSpacing: 0.5, lineHeight: 18 },
    form: { gap: 20, marginBottom: 28 },
    field: {},
    labelCard: {
      borderWidth: B,
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignSelf: "flex-start",
      marginBottom: -B,
      zIndex: 2,
      marginLeft: 12,
    },
    fieldLabel: { fontSize: 13, fontWeight: "900", color: "#000", letterSpacing: 1 },
    inputBox: {
      borderWidth: B,
      paddingVertical: 14,
      paddingHorizontal: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    textInput: { fontSize: 16, fontWeight: "700" },
    inputText: { fontSize: 16, fontWeight: "700" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
    modalCard: {
      borderWidth: B,
      width: "100%",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 6,
    },
    modalTitleCard: { borderBottomWidth: B, paddingVertical: 14, paddingHorizontal: 16, alignItems: "center" },
    modalTitleText: { fontSize: 16, fontWeight: "900", color: "#000", letterSpacing: 1 },
    spinnerPicker: { height: 180 },
    modalButtons: { flexDirection: "row", borderTopWidth: B },
    modalCancelButton: { flex: 1, paddingVertical: 16, alignItems: "center", borderRightWidth: B / 2 },
    modalConfirmButton: { flex: 1, paddingVertical: 16, alignItems: "center", borderLeftWidth: B / 2 },
    modalButtonText: { fontSize: 15, fontWeight: "900", color: "#000", letterSpacing: 1 },
    countryList: {
      borderWidth: B,
      borderTopWidth: 0,
      maxHeight: 180,
      overflow: "hidden",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    countryFlatList: { maxHeight: 180 },
    countryItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 2 },
    countryItemText: { fontSize: 15, fontWeight: "700" },
    genderRow: { flexDirection: "row", gap: 12 },
    genderButton: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
      borderWidth: B,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    genderButtonText: { fontSize: 16, fontWeight: "900", letterSpacing: 1 },
    startButton: {
      paddingVertical: 20,
      alignItems: "center",
      borderWidth: B,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: S, height: S },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5,
    },
    startButtonText: { fontSize: 20, fontWeight: "900", letterSpacing: 2 },
  });
}
