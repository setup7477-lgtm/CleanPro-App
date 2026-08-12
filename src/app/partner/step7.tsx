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

export default function PartnerStep7() {
  const router = useRouter();

  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState<"Per Hour" | "Per Day" | "Per Job" | null>(null);

  const rateOptions = ["Per Hour", "Per Day", "Per Job"];

  const handleNext = () => {
    if (!rate.trim()) {
      Alert.alert("Error", "Please enter your expected rate.");
      return;
    }
    if (!rateType) {
      Alert.alert("Error", "Please select the rate type.");
      return;
    }
    router.push("/partner/step8" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 7 of 8</Text>
      </View>

      <Text style={styles.title}>Expected Pay</Text>
      <Text style={styles.subtitle}>Enter the amount you expect to earn.</Text>

      <Text style={styles.label}>Expected Rate (Rs)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 500"
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Rate Type</Text>
      <View style={styles.row}>
        {rateOptions.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.optionBtn, rateType === r && styles.optionActive]}
            onPress={() => setRateType(r as any)}
          >
            <Text style={[styles.optionText, rateType === r && styles.optionTextActive]}>{r}</Text>
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
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e0e0e0", fontSize: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", minWidth: 80 },
  optionActive: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  optionText: { fontSize: 14, fontWeight: "500", color: "#555" },
  optionTextActive: { color: "#00aa88" },
  nextBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, marginTop: 30, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});