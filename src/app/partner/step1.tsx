import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PartnerStep1() {
  const router = useRouter();

  // State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | null>(null);
  const [maritalStatus, setMaritalStatus] = useState<"Married" | "Unmarried" | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const handleNext = () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !address.trim() || !city.trim() || !area.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (!gender) {
      Alert.alert("Error", "Please select your gender.");
      return;
    }
    if (!maritalStatus) {
      Alert.alert("Error", "Please select your marital status.");
      return;
    }

    // Navigate to Step 2
    router.push("/partner/step2" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 1 of 8</Text>
      </View>

      <Text style={styles.title}>Personal Information</Text>
      <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

      {/* First Name */}
      <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Last Name */}
      <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your last name"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Gender */}
      <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.optionBtn, gender === "Male" && styles.optionActive]}
          onPress={() => setGender("Male")}
        >
          <Text style={[styles.optionText, gender === "Male" && styles.optionTextActive]}>👨 Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, gender === "Female" && styles.optionActive]}
          onPress={() => setGender("Female")}
        >
          <Text style={[styles.optionText, gender === "Female" && styles.optionTextActive]}>👩 Female</Text>
        </TouchableOpacity>
      </View>

      {/* Marital Status */}
      <Text style={styles.label}>Marital Status <Text style={styles.required}>*</Text></Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.optionBtn, maritalStatus === "Married" && styles.optionActive]}
          onPress={() => setMaritalStatus("Married")}
        >
          <Text style={[styles.optionText, maritalStatus === "Married" && styles.optionTextActive]}>💍 Married</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, maritalStatus === "Unmarried" && styles.optionActive]}
          onPress={() => setMaritalStatus("Unmarried")}
        >
          <Text style={[styles.optionText, maritalStatus === "Unmarried" && styles.optionTextActive]}>📄 Unmarried</Text>
        </TouchableOpacity>
      </View>

      {/* Phone */}
      <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="03XX-XXXXXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Address */}
      <Text style={styles.label}>Full Address <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="House / Street / Building"
        value={address}
        onChangeText={setAddress}
      />

      {/* City */}
      <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Karachi"
        value={city}
        onChangeText={setCity}
      />

      {/* Area / Location */}
      <Text style={styles.label}>Area / Location <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Clifton, Gulshan"
        value={area}
        onChangeText={setArea}
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>Save & Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa", paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backBtn: { padding: 5 },
  backText: { fontSize: 16, fontWeight: "bold", color: "#111" },
  stepIndicator: { fontSize: 14, color: "#888", fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "bold", color: "#111" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 15, marginBottom: 5 },
  required: { color: "#dc2626" },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e0e0e0", fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  optionBtn: { flex: 1, padding: 14, backgroundColor: "#fff", borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0" },
  optionActive: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  optionText: { fontSize: 16, fontWeight: "500", color: "#555" },
  optionTextActive: { color: "#00aa88" },
  nextBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, marginTop: 30, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});