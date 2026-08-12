import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "./firebase";

// --- SEED DATA (Only used if your Firebase database is empty) ---
const SEED_BOOKINGS = [
  {
    id: "b1",
    customerId: "u1",
    cleanerId: "c5",
    serviceType: "Home Cleaning",
    packageType: "Premium",
    price: 35000,
    date: "2026-08-15",
    time: "10:00 AM",
    address: "123 Main Street, City",
    status: "On The Way",
  },
  {
    id: "b2",
    customerId: "u1",
    cleanerId: "c1",
    serviceType: "Deep Cleaning",
    packageType: "Deluxe",
    price: 18000,
    date: "2026-08-12",
    time: "09:00 AM",
    address: "456 Oak Avenue, City",
    status: "Completed",
  },
  {
    id: "b3",
    customerId: "u1",
    cleanerId: "c6",
    serviceType: "Office Cleaning",
    packageType: "Standard",
    price: 25000,
    date: "2026-08-18",
    time: "02:00 PM",
    address: "789 Corporate Blvd, City",
    status: "Pending",
  },
  {
    id: "b4",
    customerId: "u1",
    cleanerId: "c2",
    serviceType: "Home Cleaning",
    packageType: "Basic",
    price: 10000,
    date: "2026-08-05",
    time: "11:00 AM",
    address: "321 Pine Street, City",
    status: "Cancelled",
  },
];

export default function MyBookings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Completed" | "Cancelled">("Upcoming");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- LOAD DATA FROM FIREBASE CLOUD ---
  const loadBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // If database is empty, seed it with demo data
        console.log("Database empty. Seeding initial data...");
        for (const booking of SEED_BOOKINGS) {
          await addDoc(collection(db, "bookings"), booking);
        }
        // Reload data after seeding
        const newSnapshot = await getDocs(q);
        const fetchedBookings = newSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(fetchedBookings);
      } else {
        const fetchedBookings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(fetchedBookings);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      Alert.alert("Error", "Failed to load bookings from cloud.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "Upcoming") {
      return booking.status !== "Completed" && booking.status !== "Cancelled";
    }
    if (activeTab === "Completed") {
      return booking.status === "Completed";
    }
    return booking.status === "Cancelled";
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "#f59e0b";
      case "Accepted": return "#3b82f6";
      case "Cleaner Assigned": return "#8b5cf6";
      case "On The Way": return "#00aa88";
      case "Cleaning Started": return "#00aa88";
      case "Completed": return "#22c55e";
      case "Cancelled": return "#ef4444";
      default: return "#666";
    }
  };

  const renderStatusTimeline = (status: string) => {
    const steps = [
      { label: "Booking Created", done: true },
      { label: "Cleaner Accepted", done: status !== "Pending" },
      { label: "On The Way", done: ["On The Way", "Cleaning Started", "Completed"].includes(status) },
      { label: "Cleaning Started", done: ["Cleaning Started", "Completed"].includes(status) },
      { label: "Completed", done: status === "Completed" },
    ];

    if (status === "Cancelled") {
      return (
        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: "#ef4444" }]} />
            <Text style={[styles.timelineLabel, { color: "#ef4444", fontWeight: "bold" }]}>
              Booking Cancelled
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.timelineContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineLineContainer}>
              <View style={[styles.timelineDot, { backgroundColor: step.done ? "#00aa88" : "#e0e0e0" }]} />
              {index < steps.length - 1 && (
                <View style={[styles.timelineLine, { backgroundColor: step.done ? "#00aa88" : "#e0e0e0" }]} />
              )}
            </View>
            <Text style={[styles.timelineLabel, { color: step.done ? "#111" : "#999" }]}>
              {step.done ? "✅ " : "⏳ "}{step.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      [
        { text: "No, Keep it", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const bookingRef = doc(db, "bookings", bookingId);
              await updateDoc(bookingRef, { status: "Cancelled" });
              
              // Update local UI
              setBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
              );
              Alert.alert("Cancelled", "Your booking has been cancelled successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to cancel booking.");
            }
          },
        },
      ]
    );
  };

  const handleRescheduleBooking = (booking: any) => {
    Alert.alert(
      "Reschedule",
      `You are rescheduling your ${booking.serviceType} booking.\n\n[Demo] In a real app, you would select a new date/time here.`
    );
  };

  const handleRateCleaner = (booking: any) => {
    Alert.alert(
      "Rate Cleaner",
      `How would you rate ${booking.cleanerId}? (Star Rating modal would open here)`
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Bookings from Cloud...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>My Bookings</Text>

      <View style={styles.tabContainer}>
        {(["Upcoming", "Completed", "Cancelled"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No {activeTab} Bookings</Text>
          <Text style={styles.emptyDesc}>You don't have any {activeTab.toLowerCase()} bookings yet.</Text>
        </View>
      ) : (
        filteredBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>{booking.serviceType} - {booking.packageType}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
            
            <Text style={styles.cleanerInfo}>Cleaner ID: {booking.cleanerId}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.dateTimeRow}>
              <Text style={styles.dateTimeLabel}>📅 {booking.date}</Text>
              <Text style={styles.dateTimeLabel}>⏰ {booking.time}</Text>
            </View>
            
            <Text style={styles.addressText}>📍 {booking.address}</Text>
            
            <View style={styles.timelineWrapper}>
              {renderStatusTimeline(booking.status)}
            </View>
            
            <View style={styles.cardFooter}>
              <Text style={styles.priceText}>Rs {booking.price.toLocaleString()}</Text>
              
              <View style={styles.footerActions}>
                <TouchableOpacity 
                  style={styles.detailsBtn} 
                  onPress={() => router.push(`/cleaner-profile?id=${booking.cleanerId}` as any)}
                >
                  <Text style={styles.detailsBtnText}>Profile</Text>
                </TouchableOpacity>

                {activeTab === "Upcoming" && (
                  <>
                    <TouchableOpacity 
                      style={styles.rescheduleBtn} 
                      onPress={() => handleRescheduleBooking(booking)}
                    >
                      <Text style={styles.rescheduleBtnText}>🔄</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.cancelBtn} 
                      onPress={() => handleCancelBooking(booking.id)}
                    >
                      <Text style={styles.cancelBtnText}>✕</Text>
                    </TouchableOpacity>
                  </>
                )}

                {booking.status === "Completed" && (
                  <TouchableOpacity 
                    style={styles.rateBtn} 
                    onPress={() => handleRateCleaner(booking)}
                  >
                    <Text style={styles.rateBtnText}>⭐ Rate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa", paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f8f9fa" },
  loadingText: { fontSize: 16, color: "#666" },
  backBtn: { marginBottom: 15, padding: 5, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  pageTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#111" },
  
  tabContainer: { flexDirection: "row", marginBottom: 20, backgroundColor: "#fff", borderRadius: 12, padding: 4, borderWidth: 1, borderColor: "#e0e0e0" },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTabBtn: { backgroundColor: "#111" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#666" },
  activeTabText: { color: "#fff" },

  emptyState: { alignItems: "center", marginTop: 40 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  emptyDesc: { fontSize: 14, color: "#666", marginTop: 5 },

  bookingCard: { backgroundColor: "#fff", borderRadius: 16, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: "#e0e0e0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  serviceName: { fontSize: 18, fontWeight: "bold", color: "#111", flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start" },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  cleanerInfo: { fontSize: 14, color: "#666", marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  dateTimeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  dateTimeLabel: { fontSize: 14, color: "#555" },
  addressText: { fontSize: 14, color: "#555", marginBottom: 15 },
  
  timelineWrapper: { marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: "#f8f9fa", borderRadius: 10, borderWidth: 1, borderColor: "#eee" },
  timelineContainer: { paddingVertical: 5 },
  timelineItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  timelineLineContainer: { alignItems: "center", marginRight: 12, width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: "#e0e0e0" },
  timelineLine: { width: 2, height: 20, marginTop: 2 },
  timelineLabel: { fontSize: 14, fontWeight: "500", paddingTop: -2 },

  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 15 },
  priceText: { fontSize: 18, fontWeight: "bold", color: "#00aa88" },
  footerActions: { flexDirection: "row", gap: 10 },
  
  detailsBtn: { backgroundColor: "#f0fdfa", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#00aa88" },
  detailsBtnText: { color: "#00aa88", fontWeight: "bold", fontSize: 12 },
  
  rateBtn: { backgroundColor: "#fff3cd", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#ffc107" },
  rateBtnText: { color: "#856404", fontWeight: "bold", fontSize: 12 },

  rescheduleBtn: { backgroundColor: "#e0f2fe", width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#7dd3fc" },
  rescheduleBtnText: { fontSize: 16 },
  cancelBtn: { backgroundColor: "#fee2e2", width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#fecaca" },
  cancelBtnText: { fontSize: 16, fontWeight: "bold", color: "#dc2626" },
});