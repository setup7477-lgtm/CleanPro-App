import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CLEANERS } from "./constants/cleaners";

export default function ExploreScreen() {
  const router = useRouter();

  const services = [
    { id: 1, title: "Home Cleaning", icon: "🏠", route: "/home-cleaning" },
    { id: 2, title: "Deep Cleaning", icon: "✨", route: "/deep-cleaning" },
    { id: 3, title: "Office Cleaning", icon: "🏢", route: "/office-cleaning" },
  ];

  // Show top 3 cleaners for the "Popular Cleaners" section
  const topCleaners = CLEANERS.filter((c) => c.isAvailable).slice(0, 3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Find the perfect cleaner for your home or office</Text>
      </View>

      {/* Service Grid */}
      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.gridContainer}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.gridCard}
            onPress={() => router.push(service.route as any)}
          >
            <Text style={styles.gridIcon}>{service.icon}</Text>
            <Text style={styles.gridTitle}>{service.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popular Cleaners */}
      <Text style={styles.sectionTitle}>Popular Cleaners</Text>
      <View style={styles.cleanerList}>
        {topCleaners.map((cleaner) => (
          <TouchableOpacity
            key={cleaner.id}
            style={styles.cleanerCard}
            onPress={() => router.push(`/cleaner-profile?id=${cleaner.id}` as any)}
          >
            <Image source={{ uri: cleaner.avatar }} style={styles.cleanerAvatar} />
            <View style={styles.cleanerInfo}>
              <Text style={styles.cleanerName}>{cleaner.name}</Text>
              <View style={styles.cleanerMeta}>
                <Text style={styles.cleanerRating}>⭐ {cleaner.rating}</Text>
                <Text style={styles.cleanerPrice}>Rs {cleaner.pricePerHour}/hr</Text>
              </View>
              <Text style={styles.cleanerExp}>{cleaner.experience} exp</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 15,
    marginTop: 10,
  },
  
  // Service Grid
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  // Cleaner List
  cleanerList: {
    marginTop: 5,
  },
  cleanerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cleanerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cleanerInfo: {
    flex: 1,
  },
  cleanerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  cleanerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  cleanerRating: {
    fontSize: 14,
    color: "#666",
  },
  cleanerPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00aa88",
  },
  cleanerExp: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});