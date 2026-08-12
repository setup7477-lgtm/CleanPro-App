import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PartnerStep9() {
  const router = useRouter();

  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);

  const handleSubmit = () => {
    if (!consent1 || !consent2 || !consent3) {
      Alert.alert("Error", "Please check all consent boxes to proceed.");
      return;
    }

    Alert.alert(
      "Application Submitted 🎉",
      "Thank you for applying to become a CleanPro Partner. Your application is under review.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/"), // Go back to Home page
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 9 of 9</Text>
      </View>

      <Text style={styles.title}>Review & Submit</Text>
      <Text style={styles.subtitle}>Please review your information and confirm your consent.</Text>

      {/* Summary Placeholder */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Application Summary</Text>
        <Text style={styles.summaryItem}>✅ Personal Information entered</Text>
        <Text style={styles.summaryItem}>✅ Family/Emergency documents uploaded</Text>
        <Text style={styles.summaryItem}>✅ Identity document uploaded</Text>
        <Text style={styles.summaryItem}>✅ Profile photos uploaded</Text>
        <Text style={styles.summaryItem}>✅ Services selected</Text>
        <Text style={styles.summaryItem}>✅ Availability & Pay set</Text>
        <Text style={styles.summaryItem}>✅ Experience & Languages added</Text>
      </View>

      {/* Consent Checkboxes */}
      <View style={styles.consentSection}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsent1(!consent1)}>
          <Text style={styles.checkbox}>{consent1 ? "☑" : "☐"}</Text>
          <Text style={styles.consentText}>
            I confirm that the information and documents I provided are accurate.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsent2(!consent2)}>
          <Text style={styles.checkbox}>{consent2 ? "☑" : "☐"}</Text>
          <Text style={styles.consentText}>
            I agree to CleanPro's Partner Terms and Privacy Policy.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setConsent3(!consent3)}>
          <Text style={styles.checkbox}>{consent3 ? "☑" : "☐"}</Text>
          <Text style={styles.consentText}>
            I understand that my documents may be reviewed by CleanPro for verification.
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit Partner Application</Text>
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
  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 25,
  },
  summaryTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#111" },
  summaryItem: { fontSize: 16, color: "#555", marginBottom: 8 },
  consentSection: { marginBottom: 25 },
  checkboxRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 15, gap: 10 },
  checkbox: { fontSize: 22, color: "#00aa88", marginTop: 2 },
  consentText: { fontSize: 16, color: "#555", flex: 1, lineHeight: 22 },
  submitBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, alignItems: "center" },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});