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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { getCountries } from "../utils/calculations";

const countries = getCountries();

export default function InputScreen() {
  const router = useRouter();
  const [birthday, setBirthday] = useState(new Date(1990, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    if (Platform.OS === "android") setShowDatePicker(false);
    setBirthday(date);
  };

  const canCalculate = country !== "";

  const handleCalculate = () => {
    if (!canCalculate) return;
    router.push({
      pathname: "/result",
      params: {
        birthday: birthday.toISOString(),
        country,
        gender,
      },
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>How Many Weeks?</Text>
          <Text style={styles.subtitle}>
            See your life in weeks based on{"\n"}average life expectancy
          </Text>
        </View>

        <View style={styles.form}>
          {/* Birthday */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Birthday</Text>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={birthday}
                mode="date"
                display="compact"
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                onValueChange={onDateChange}
                style={styles.datePicker}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDate(birthday)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthday}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                    onValueChange={onDateChange}
                  />
                )}
              </>
            )}
          </View>

          {/* Country */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Country</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor="#aaa"
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
                      style={styles.countryItem}
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
                          item === country && styles.countryItemSelected,
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
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "male" && styles.genderButtonActive,
                ]}
                onPress={() => setGender("male")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "male" && styles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "female" && styles.genderButtonActive,
                ]}
                onPress={() => setGender("female")}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "female" && styles.genderButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.calculateButton, !canCalculate && styles.calculateButtonDisabled]}
          onPress={handleCalculate}
          disabled={!canCalculate}
        >
          <Text style={styles.calculateButtonText}>Calculate</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: 24,
    marginBottom: 32,
  },
  field: {
    zIndex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  datePicker: {
    alignSelf: "flex-start",
  },
  dateButton: {
    backgroundColor: "#f5f5f7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#1a1a2e",
  },
  searchInput: {
    backgroundColor: "#f5f5f7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#1a1a2e",
  },
  countryList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    maxHeight: 200,
    overflow: "hidden",
  },
  countryFlatList: {
    maxHeight: 200,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  countryItemText: {
    fontSize: 15,
    color: "#333",
  },
  countryItemSelected: {
    color: "#4a6cf7",
    fontWeight: "600",
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f5f5f7",
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#4a6cf7",
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  calculateButton: {
    backgroundColor: "#1a1a2e",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  calculateButtonDisabled: {
    opacity: 0.4,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
