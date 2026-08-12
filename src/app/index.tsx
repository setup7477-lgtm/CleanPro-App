import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { Cleaner } from "./constants/cleaners";
import { useAvailability } from "./context/AvailabilityContext";

export default function Home() {
  const router = useRouter();
  
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const { availableCleaners } = useAvailability();

  // Filter available cleaners
  const totalAvailable = availableCleaners.filter((c) => c.isAvailable).length;
  const filteredCleaners = availableCleaners
    .filter((c: Cleaner) => c.gender === gender && c.isAvailable)
    .slice(0, 3);

  const services = [
    {
      title: "Home Cleaning",
      icon: "🏠",
      description: "Complete house cleaning service",
      route: "/home-cleaning",
    },
    {
      title: "Deep Cleaning",
      icon: "✨",
      description: "Professional deep cleaning",
      route: "/deep-cleaning",
    },
    {
      title: "Office Cleaning",
      icon: "🏢",
      description: "Clean workspace solutions",
      route: "/office-cleaning",
    },
  ];

  // Static fallback data
  const staticCleaners = [
    { name: "Ali Khan", rating: "4.9", price: "500" },
    { name: "Ahmed Raza", rating: "4.8", price: "600" },
    { name: "Usman Ali", rating: "5.0", price: "700" },
  ];

  // For the map, pick a central location (e.g., Karachi) and show all available cleaners
  const mapCleaners = availableCleaners.filter((c) => c.isAvailable && c.coordinate);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CleanPro 🧹</Text>
        <Text style={styles.subtitle}>
          Professional Cleaning Services Near You
        </Text>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          ⭐ 4.9 Rating | Trusted by 1000+ Customers
        </Text>
      </View>

      {/* Real-Time Availability Bar */}
      <View style={styles.availabilityBar}>
        <View style={styles.availabilityDot} />
        <Text style={styles.availabilityText}>
          {totalAvailable} Cleaners Available Now
        </Text>
        <Text style={styles.availabilitySub}>
          Book instantly - No waiting!
        </Text>
      </View>

      {/* ===== LIVE MAP VIEW ===== */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 24.8607, // Center of Karachi
            longitude: 67.0011,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {mapCleaners.map((cleaner) => (
            <Marker
              key={cleaner.id}
              coordinate={cleaner.coordinate}
              title={cleaner.name}
              description={`⭐ ${cleaner.rating} | Rs ${cleaner.pricePerHour}/hr`}
              pinColor="#00aa88"
            >
              <Callout>
                <View style={styles.calloutView}>
                  <Text style={styles.calloutText}>{cleaner.name}</Text>
                  <Text style={styles.calloutSub}>⭐ {cleaner.rating} • Available</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Special Offers */}
      <Text style={styles.sectionTitle}>🔥 Special Offers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offerScroll}>
        <TouchableOpacity style={styles.offerCard} onPress={() => router.push("/home-cleaning" as any)}>
          <Text style={styles.offerEmoji}>🧹</Text>
          <Text style={styles.offerTitle}>Home Cleaning</Text>
          <Text style={styles.offerPrice}>20% OFF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.offerCard} onPress={() => router.push("/deep-cleaning" as any)}>
          <Text style={styles.offerEmoji}>✨</Text>
          <Text style={styles.offerTitle}>Deep Cleaning</Text>
          <Text style={styles.offerPrice}>15% OFF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.offerCard} onPress={() => router.push("/office-cleaning" as any)}>
          <Text style={styles.offerEmoji}>🏢</Text>
          <Text style={styles.offerTitle}>Office Cleaning</Text>
          <Text style={styles.offerPrice}>10% OFF</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Quick Booking */}
      <TouchableOpacity style={styles.quickBooking} onPress={() => router.push("/explore" as any)}>
        <Text style={styles.quickBookingEmoji}>📅</Text>
        <View>
          <Text style={styles.quickBookingTitle}>Need a cleaner right now?</Text>
          <Text style={styles.quickBookingSub}>Tap here to browse all available cleaners</Text>
        </View>
        <Text style={styles.quickBookingArrow}>›</Text>
      </TouchableOpacity>

      {/* Services */}
      <Text style={styles.sectionTitle}>Our Services</Text>
      {services.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push(item.route as any)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Top Cleaners */}
      <View style={styles.cleanerHeaderRow}>
        <Text style={styles.sectionTitle}>Top Cleaners</Text>
        <View style={styles.genderTabs}>
          <TouchableOpacity
            style={[styles.genderTab, gender === "Male" && styles.activeGenderTab]}
            onPress={() => setGender("Male")}
          >
            <Text style={[styles.genderTabText, gender === "Male" && styles.activeGenderText]}>👨 Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderTab, gender === "Female" && styles.activeGenderTab]}
            onPress={() => setGender("Female")}
          >
            <Text style={[styles.genderTabText, gender === "Female" && styles.activeGenderText]}>👩 Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredCleaners.length > 0 ? (
        filteredCleaners.map((cleaner: Cleaner) => (
          <View key={cleaner.id} style={styles.cleanerCard}>
            <Text style={styles.cleanerName}>{cleaner.name}</Text>
            <Text style={styles.rating}>⭐ {cleaner.rating}</Text>
            <Text style={styles.price}>Starting Rs {cleaner.pricePerHour}</Text>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => router.push("/home-cleaning" as any)}
            >
              <Text style={styles.buttonText}>Book Cleaner</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        staticCleaners.map((item, index) => (
          <View key={index} style={styles.cleanerCard}>
            <Text style={styles.cleanerName}>{item.name}</Text>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.price}>Starting Rs {item.price}</Text>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => router.push("/home-cleaning" as any)}
            >
              <Text style={styles.buttonText}>Book Cleaner</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Help & Support */}
      <TouchableOpacity style={styles.helpSupport} onPress={() => Alert.alert("Support", "📞 Call us at: +92 300 1234567\n\n✉️ Email: support@cleanpro.com")}>
        <Text style={styles.helpEmoji}>❓</Text>
        <Text style={styles.helpText}>Need help? Contact our 24/7 Support Team</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginTop: 20, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#111" },
  subtitle: { marginTop: 8, color: "#666", fontSize: 16 },
  banner: { backgroundColor: "#111", padding: 18, borderRadius: 15, marginBottom: 25 },
  bannerText: { color: "white", fontSize: 16 },

  // Availability Bar
  availabilityBar: {
    backgroundColor: "#e6fffa",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00aa88",
    marginBottom: 20,
    flexDirection: "column",
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22c55e",
    marginRight: 10,
    display: "none", // Hidden, we just use text
  },
  availabilityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00aa88",
  },
  availabilitySub: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  // Map Styles
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  calloutView: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  calloutText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  calloutSub: {
    fontSize: 12,
    color: "#666",
  },

  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 10, color: "#111" },

  // Special Offers
  offerScroll: { marginBottom: 15, paddingBottom: 5 },
  offerCard: { backgroundColor: "#fff", padding: 20, borderRadius: 16, marginRight: 12, alignItems: "center", width: 130, borderWidth: 1, borderColor: "#e0e0e0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  offerEmoji: { fontSize: 36, marginBottom: 5 },
  offerTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  offerPrice: { fontSize: 12, color: "#00aa88", fontWeight: "bold", backgroundColor: "#e6fffa", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },

  // Quick Booking
  quickBooking: { backgroundColor: "#00aa88", padding: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", marginBottom: 20 },
  quickBookingEmoji: { fontSize: 28, marginRight: 12 },
  quickBookingTitle: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  quickBookingSub: { fontSize: 12, color: "#e0f2f1" },
  quickBookingArrow: { fontSize: 28, color: "#fff", marginLeft: "auto", fontWeight: "300" },

  // Services
  card: { backgroundColor: "white", padding: 20, borderRadius: 18, flexDirection: "row", alignItems: "center", marginBottom: 15 },
  icon: { fontSize: 35, marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111" },
  description: { color: "#777", marginTop: 5 },
  arrow: { fontSize: 30, color: "#999", marginLeft: 10 },

  // Top Cleaners
  cleanerHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 15 },
  genderTabs: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 2, borderWidth: 1, borderColor: "#e0e0e0" },
  genderTab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 18 },
  activeGenderTab: { backgroundColor: "#00aa88" },
  genderTabText: { fontSize: 14, fontWeight: "500", color: "#666" },
  activeGenderText: { color: "#fff" },

  cleanerCard: { backgroundColor: "white", padding: 20, borderRadius: 18, marginBottom: 15 },
  cleanerName: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#111" },
  rating: { fontSize: 15, marginBottom: 5 },
  price: { color: "#555", fontSize: 15 },
  button: { backgroundColor: "#111", padding: 14, borderRadius: 12, marginTop: 15 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },

  // Help
  helpSupport: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#e0e0e0", marginTop: 10 },
  helpEmoji: { fontSize: 20, marginRight: 10 },
  helpText: { color: "#555", fontWeight: "500" },
});