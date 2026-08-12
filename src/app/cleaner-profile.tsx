import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CLEANERS, Cleaner } from "./constants/cleaners";

// Demo Reviews for Phase 5
const DEMO_REVIEWS = [
  {
    id: "r1",
    customerName: "John D.",
    rating: 5,
    comment: "Amazing work! Left my house sparkling clean.",
    date: "2 days ago",
  },
  {
    id: "r2",
    customerName: "Sarah M.",
    rating: 4,
    comment: "Very professional and on time. Highly recommended.",
    date: "1 week ago",
  },
  {
    id: "r3",
    customerName: "David L.",
    rating: 5,
    comment: "Best cleaner I've ever hired. 10/10.",
    date: "2 weeks ago",
  },
];

export default function CleanerProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const cleanerId = params.id as string;
  const cleaner: Cleaner | undefined = CLEANERS.find((c) => c.id === cleanerId);

  if (!cleaner) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Cleaner not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={{ uri: cleaner.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{cleaner.name}</Text>
        <Text style={styles.gender}>{cleaner.gender}</Text>
        
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {cleaner.rating}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{cleaner.jobsCompleted}</Text>
          <Text style={styles.statLabel}>Jobs Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{cleaner.experience}</Text>
          <Text style={styles.statLabel}>Experience</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{cleaner.isAvailable ? "🟢" : "🔴"}</Text>
          <Text style={styles.statLabel}>{cleaner.isAvailable ? "Available" : "Busy"}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        <View style={styles.serviceTags}>
          {cleaner.services.map((service, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Base Pricing</Text>
        <Text style={styles.priceText}>Starting from Rs {cleaner.pricePerHour.toLocaleString()} / hour</Text>
      </View>

      {/* 🚀 PHASE 5: REVIEWS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        {DEMO_REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.customerName}</Text>
              <Text style={styles.reviewRating}>{"⭐".repeat(review.rating)}</Text>
            </View>
            <Text style={styles.reviewComment}>"{review.comment}"</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.bookBtn, !cleaner.isAvailable && styles.bookBtnDisabled]}
        disabled={!cleaner.isAvailable}
        onPress={() => router.back()}
      >
        <Text style={styles.bookBtnText}>
          {cleaner.isAvailable ? "Book This Cleaner" : "Currently Unavailable"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa", paddingBottom: 40 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 18, color: "#666", marginBottom: 20 },
  
  backBtn: { marginBottom: 15, padding: 5, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: 'bold', color: '#111' },

  header: { alignItems: 'center', marginBottom: 25 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#00aa88", marginBottom: 15 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#111' },
  gender: { fontSize: 16, color: '#666', marginBottom: 10 },
  ratingBadge: { backgroundColor: "#f0fdfa", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#00aa88" },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: "#00aa88" },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, gap: 10 },
  statCard: { flex: 1, backgroundColor: "#fff", padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: "#e0e0e0" },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  
  serviceTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { backgroundColor: "#f0fdfa", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#00aa88" },
  tagText: { color: "#00aa88", fontWeight: '500' },

  priceText: { fontSize: 16, color: '#111', fontWeight: '500' },

  // 🚀 REVIEWS STYLES
  reviewCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e0e0e0" },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  reviewerName: { fontSize: 14, fontWeight: "bold", color: "#111" },
  reviewRating: { fontSize: 14, color: "#f59e0b" },
  reviewComment: { fontSize: 14, color: "#555", fontStyle: "italic", marginBottom: 5 },
  reviewDate: { fontSize: 12, color: "#999" },

  bookBtn: { backgroundColor: "#111", padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  bookBtnDisabled: { backgroundColor: "#999" },
  bookBtnText: { color: "#fff", fontWeight: 'bold', fontSize: 16 },
});