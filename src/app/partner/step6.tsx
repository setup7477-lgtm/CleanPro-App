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

export default function PartnerStep6() {
  const router = useRouter();

  const [hours, setHours] = useState<number | null>(null);
  const [availability, setAvailability] = useState<"Full Time" | "Part Time" | "Flexible" | null>(null);

  const hourOptions = [2, 4, 6, 8, 10, 12];
  const availabilityOptions = ["Full Time", "Part Time", "Flexible"] as const;

  const handleNext = () => {
    if (!hours) {
      Alert.alert("Error", "Please select your maximum hours per day.");
      return;
    }
    if (!availability) {
      Alert.alert("Error", "Please select your availability type.");
      return;
    }
    router.push("/partner/step7" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 6 of 8</Text>
      </View>

      <Text style={styles.title}>Working Availability</Text>
      <Text style={styles.subtitle}>Tell us about your availability.</Text>

      <Text style={styles.label}>How many hours can you work per day?</Text>
      <View style={styles.row}>
        {hourOptions.map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.optionBtn, hours === h && styles.optionActive]}
            onPress={() => setHours(h)}
          >
            <Text style={[styles.optionText, hours === h && styles.optionTextActive]}>{h} Hours</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Availability Type</Text>
      <View style={styles.row}>
        {availabilityOptions.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.optionBtn, availability === a && styles.optionActive]}
            onPress={() => setAvailability(a)}
          >
            <Text style={[styles.optionText, availability === a && styles.optionTextActive]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
  label: { fontSize: 16, fontWeight: "600", color: "#555", marginTop: 15, marginBottom: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 15 },
  optionBtn: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  optionActive: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  optionText: { fontSize: 14, fontWeight: "500", color: "#555" },
  optionTextActive: { color: "#00aa88" },
  nextBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, marginTop: 30, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});