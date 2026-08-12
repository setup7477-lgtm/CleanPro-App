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
import { SERVICE_LIST } from "../constants/partner-services";

export default function PartnerStep5() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedServices.length === SERVICE_LIST.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(SERVICE_LIST.map((s) => s.id));
    }
  };

  const handleNext = () => {
    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please select at least one service.");
      return;
    }
    router.push("/partner/step6" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 5 of 8</Text>
      </View>

      <Text style={styles.title}>Services & Skills</Text>
      <Text style={styles.subtitle}>Select the services you can provide.</Text>

      <TouchableOpacity style={styles.selectAllBtn} onPress={toggleSelectAll}>
        <Text style={styles.selectAllText}>
          {selectedServices.length === SERVICE_LIST.length ? "❌ Deselect All" : "✅ Select All"}
        </Text>
      </TouchableOpacity>

      {SERVICE_LIST.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={[styles.serviceItem, selectedServices.includes(service.id) && styles.serviceSelected]}
          onPress={() => toggleService(service.id)}
        >
          <Text style={styles.serviceLabel}>
            {selectedServices.includes(service.id) ? "☑" : "☐"} {service.label}
          </Text>
        </TouchableOpacity>
      ))}

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
  selectAllBtn: { backgroundColor: "#e6fffa", padding: 14, borderRadius: 10, marginBottom: 15, alignItems: "center", borderWidth: 1, borderColor: "#00aa88" },
  selectAllText: { color: "#00aa88", fontWeight: "bold" },
  serviceItem: { backgroundColor: "#fff", padding: 16, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  serviceSelected: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  serviceLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
  nextBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, marginTop: 30, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});