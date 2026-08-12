import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Cleaner } from "./constants/cleaners";
import { useAvailability } from "./context/AvailabilityContext";

export default function OfficeCleaning() {
  const router = useRouter();

  const [plan, setPlan] = useState<"Basic" | "Standard" | "Premium">("Basic");
  const [gender, setGender] = useState<"Male" | "Female">("Male");

  const prices = {
    Basic: { price: 15000, hours: "4 Hours", contract: "Month" },
    Standard: { price: 25000, hours: "6 Hours", contract: "Month" },
    Premium: { price: 40000, hours: "8 Hours", contract: "Month" },
  };

  // USE GLOBAL CONTEXT
  const { availableCleaners } = useAvailability();
  const cleaners = availableCleaners.filter((c: Cleaner) => c.gender === gender && c.isAvailable);

  const [selectedCleaner, setSelectedCleaner] = useState<Cleaner>(
    cleaners.length > 0 ? cleaners[0] : availableCleaners[0]
  );

  const handleGenderChange = (newGender: "Male" | "Female") => {
    setGender(newGender);
    const newCleaners = availableCleaners.filter((c: Cleaner) => c.gender === newGender && c.isAvailable);
    if (newCleaners.length > 0) {
      setSelectedCleaner(newCleaners[0]);
    }
  };

  const handleBook = () => {
    const selectedPrice = prices[plan].price;
    router.push({
      pathname: "/booking",
      params: {
        serviceType: "Office Cleaning",
        packageType: plan,
        hours: prices[plan].hours,
        contract: prices[plan].contract,
        price: selectedPrice,
        cleanerName: selectedCleaner.name,
        cleanerGender: selectedCleaner.gender,
        cleanerRating: selectedCleaner.rating,
        cleanerId: selectedCleaner.id,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏢 Office Cleaning</Text>
      <Text style={styles.subtitle}>Corporate cleaning packages</Text>

      {(["Basic", "Standard", "Premium"] as const).map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.card, plan === item && styles.activeCard]}
          onPress={() => setPlan(item)}
        >
          <Text style={styles.planTitle}>{item}</Text>
          <Text style={styles.planDesc}>
            {item === "Basic" && "Small office floor cleaning"}
            {item === "Standard" && "Full office + washrooms + pantry"}
            {item === "Premium" && "Glass + deep sanitization + carpets"}
          </Text>
          <View style={styles.planMeta}>
            <Text style={styles.planPrice}>Rs {prices[item].price.toLocaleString()}</Text>
            <Text style={styles.planHours}>{prices[item].hours} / {prices[item].contract}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionHeader}>Select Worker</Text>
      <View style={styles.genderRow}>
        <TouchableOpacity
          style={[styles.genderBtn, gender === "Male" && styles.activeGender]}
          onPress={() => handleGenderChange("Male")}
        >
          <Text style={styles.genderText}>👨 Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderBtn, gender === "Female" && styles.activeGender]}
          onPress={() => handleGenderChange("Female")}
        >
          <Text style={styles.genderText}>👩 Female</Text>
        </TouchableOpacity>
      </View>

      {cleaners.map((cleaner: Cleaner) => (
        <TouchableOpacity
          key={cleaner.id}
          style={[
            styles.cleanerCard, 
            selectedCleaner.id === cleaner.id && styles.activeCleaner,
            !cleaner.isAvailable && styles.unavailableCleaner
          ]}
          disabled={!cleaner.isAvailable}
          onPress={() => setSelectedCleaner(cleaner)}
        >
          <View style={styles.cleanerInfo}>
            <Text style={styles.cleanerName}>{cleaner.name}</Text>
            <Text style={styles.cleanerRating}>⭐ {cleaner.rating} ({cleaner.jobsCompleted} jobs)</Text>
            <Text style={styles.cleanerExperience}>{cleaner.experience} experience</Text>
          </View>
          {!cleaner.isAvailable ? (
            <Text style={styles.unavailableText}>⚪ Busy</Text>
          ) : (
            <Text style={styles.availableText}>🟢 Available</Text>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleBook}>
        <Text style={styles.btnText}>Book Office Cleaning</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa", paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "bold", color: "#111" },
  subtitle: { color: "#666", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 18, borderRadius: 14, marginBottom: 15, borderWidth: 1, borderColor: "#e0e0e0" },
  activeCard: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  planTitle: { fontSize: 18, fontWeight: "bold" },
  planDesc: { color: "#666", marginTop: 4, marginBottom: 10 },
  planMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planPrice: { fontSize: 18, fontWeight: "bold", color: "#00aa88" },
  planHours: { fontSize: 14, color: "#888" },
  sectionHeader: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 15 },
  genderRow: { flexDirection: "row", marginBottom: 15 },
  genderBtn: { flex: 1, padding: 12, backgroundColor: "#fff", borderRadius: 10, alignItems: "center", marginHorizontal: 5, borderWidth: 1, borderColor: "#e0e0e0" },
  activeGender: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  genderText: { fontSize: 16, fontWeight: "500" },
  cleanerCard: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    padding: 15, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#eee" 
  },
  activeCleaner: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  unavailableCleaner: { opacity: 0.6, backgroundColor: "#f9f9f9" },
  cleanerInfo: { flex: 1 },
  cleanerName: { fontSize: 16, fontWeight: "500" },
  cleanerRating: { fontSize: 14, color: "#666", marginTop: 2 },
  cleanerExperience: { fontSize: 12, color: "#888", marginTop: 2 },
  availableText: { fontSize: 12, fontWeight: "bold", color: "#00aa88" },
  unavailableText: { fontSize: 12, fontWeight: "bold", color: "#999" },
  button: { marginTop: 30, backgroundColor: "#111", padding: 18, borderRadius: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});