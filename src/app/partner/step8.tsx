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

export default function PartnerStep8() {
  const router = useRouter();

  const [experience, setExperience] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  const expOptions = ["No Experience", "Less than 1 Year", "1–2 Years", "3–5 Years", "5+ Years"];
  const langOptions = ["Urdu", "English", "Punjabi", "Sindhi", "Pashto", "Other"];

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleNext = () => {
    if (!experience) {
      Alert.alert("Error", "Please select your experience level.");
      return;
    }
    router.push("/partner/step9" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 8 of 8</Text>
      </View>

      <Text style={styles.title}>Experience & Languages</Text>
      <Text style={styles.subtitle}>Tell us about your background.</Text>

      <Text style={styles.label}>Experience Level</Text>
      <View style={styles.row}>
        {expOptions.map((e) => (
          <TouchableOpacity
            key={e}
            style={[styles.optionBtn, experience === e && styles.optionActive]}
            onPress={() => setExperience(e)}
          >
            <Text style={[styles.optionText, experience === e && styles.optionTextActive]}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Previous Experience / Details (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tell us more about your experience..."
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Languages Spoken</Text>
      <View style={styles.row}>
        {langOptions.map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.langBtn, languages.includes(l) && styles.langActive]}
            onPress={() => toggleLanguage(l)}
          >
            <Text style={[styles.langText, languages.includes(l) && styles.langTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>Review Application →</Text>
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
  textArea: { minHeight: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 15 },
  optionBtn: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  optionActive: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  optionText: { fontSize: 14, fontWeight: "500", color: "#555" },
  optionTextActive: { color: "#00aa88" },
  langBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#fff", borderRadius: 20, borderWidth: 1, borderColor: "#e0e0e0" },
  langActive: { backgroundColor: "#00aa88", borderColor: "#00aa88" },
  langText: { fontSize: 14, fontWeight: "500", color: "#555" },
  langTextActive: { color: "#fff" },
  nextBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, marginTop: 30, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});