import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { addDoc, collection } from "firebase/firestore";
import AppOverlayLoader from "../components/AppOverlayLoader";
import { auth, db } from "./firebase";

export default function Booking() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const serviceType = (params.serviceType as string) || "Service";
  const packageType = (params.packageType as string) || "Package";
  const cleanerName = (params.cleanerName as string) || "Not Selected";
  const cleanerGender = (params.cleanerGender as string) || "N/A";
  const cleanerRating = parseFloat(params.cleanerRating as string) || 0;
  const hours = (params.hours as string) || "N/A";
  const contract = (params.contract as string) || "N/A";
  const price = parseFloat(params.price as string) || 0;
  const cleanerId = params.cleanerId as string;

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState(""); 
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLocationLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Location permission is required.");
          setLocationLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDate(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTime(false);
    if (selectedTime) setTime(selectedTime);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri);
    }
  };

  const handleConfirmBooking = async () => {
    if (!userName || !userPhone || !address) { 
      Alert.alert("Error", "Please fill in Name, Phone, and Address.");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }

    if (!screenshot) {
      Alert.alert("Upload Required", `Please upload a screenshot of your ${paymentMethod} payment receipt.`);
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to book.");
      return;
    }

    setIsProcessing(true);

    try {
      await addDoc(collection(db, "bookings"), {
        customerId: currentUser.uid,
        customerName: userName,
        customerPhone: userPhone, 
        cleanerId: cleanerId,
        serviceType: serviceType,
        packageType: packageType,
        price: price,
        date: date.toISOString().split('T')[0], 
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        address: address,
        location: location || { latitude: 0, longitude: 0 }, 
        paymentMethod: paymentMethod,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
      
      setIsProcessing(false);
      Alert.alert("Success 🎉", "Booking Confirmed! We have your exact location.");
      
      setUserName("");
      setUserPhone("");
      setAddress("");
      setScreenshot(null);
      setPaymentMethod(null);
      router.replace("/");
      
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert("Error", error.message || "Failed to process booking.");
    }
  };

  const openPaymentModal = (method: string) => {
    setPaymentMethod(method);
    setModalVisible(true);
  };

  const renderPaymentDetails = () => {
    if (paymentMethod === "Bank Al Habib") {
      return (
        <View>
          <Text style={styles.modalDetailTitle}>🏦 Bank Al Habib</Text>
          <Text style={styles.modalDetail}>Account Title: CleanPro Services</Text>
          <Text style={styles.modalDetail}>IBAN: PK74 BAHL 1234 5678 9012 3456</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={() => Alert.alert("Copied!", "IBAN copied to clipboard (Demo)")}>
            <Text style={styles.copyBtnText}>📋 Copy IBAN</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (paymentMethod === "EasyPaisa") {
      return (
        <View>
          <Text style={styles.modalDetailTitle}>📱 EasyPaisa</Text>
          <Text style={styles.modalDetail}>Account Number: 0333 1234567</Text>
          <Text style={styles.modalDetail}>Account Name: CleanPro Services</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={() => Alert.alert("Copied!", "Number copied to clipboard (Demo)")}>
            <Text style={styles.copyBtnText}>📋 Copy Number</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (paymentMethod === "JazzCash") {
      return (
        <View>
          <Text style={styles.modalDetailTitle}>📱 JazzCash</Text>
          <Text style={styles.modalDetail}>Account Number: 0300 7654321</Text>
          <Text style={styles.modalDetail}>Account Name: CleanPro Services</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={() => Alert.alert("Copied!", "Number copied to clipboard (Demo)")}>
            <Text style={styles.copyBtnText}>📋 Copy Number</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Confirm Booking</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{serviceType} - {packageType}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cleaner:</Text>
            <Text style={styles.summaryValue}>{cleanerName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gender:</Text>
            <Text style={styles.summaryValue}>{cleanerGender}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rating:</Text>
            <Text style={styles.summaryValue}>⭐ {cleanerRating}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Working Hours:</Text>
            <Text style={styles.summaryValue}>{hours} / Day</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Contract:</Text>
            <Text style={styles.summaryValue}>{contract}</Text>
          </View>
          <View style={styles.divider} />
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <Text style={styles.totalValue}>Rs {price.toLocaleString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Your Details</Text>
        <TextInput placeholder="Full Name" style={styles.input} value={userName} onChangeText={setUserName} />
        <TextInput placeholder="Phone Number" style={styles.input} value={userPhone} onChangeText={setUserPhone} keyboardType="phone-pad" />
        <TextInput placeholder="Service Address" style={styles.input} value={address} onChangeText={setAddress} />

        <View style={styles.locationBox}>
          {locationLoading ? (
            <Text style={styles.locationText}>📍 Fetching your exact location...</Text>
          ) : location ? (
            <Text style={styles.locationText}>📍 Location captured</Text>
          ) : (
            <Text style={styles.locationText}>📍 Location permission required</Text>
          )}
        </View>

        <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
          <Text>📅 {date.toDateString()}</Text>
        </TouchableOpacity>
        {showDate && <DateTimePicker value={date} mode="date" onChange={onDateChange} />}
        <TouchableOpacity style={styles.input} onPress={() => setShowTime(true)}>
          <Text>⏰ {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </TouchableOpacity>
        {showTime && <DateTimePicker value={time} mode="time" onChange={onTimeChange} />}

        <Text style={styles.sectionHeader}>Payment Method</Text>
        <View style={styles.paymentBox}>
          <TouchableOpacity
            style={[styles.payBtn, paymentMethod === "Bank Al Habib" && styles.activePay]}
            onPress={() => openPaymentModal("Bank Al Habib")}
          >
            <Text style={paymentMethod === "Bank Al Habib" ? styles.activePayText : styles.payText}>🏦 Bank Al Habib</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.payBtn, paymentMethod === "EasyPaisa" && styles.activePay]}
            onPress={() => openPaymentModal("EasyPaisa")}
          >
            <Text style={paymentMethod === "EasyPaisa" ? styles.activePayText : styles.payText}>📱 EasyPaisa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.payBtn, paymentMethod === "JazzCash" && styles.activePay]}
            onPress={() => openPaymentModal("JazzCash")}
          >
            <Text style={paymentMethod === "JazzCash" ? styles.activePayText : styles.payText}>📱 JazzCash</Text>
          </TouchableOpacity>
        </View>

        {paymentMethod && (
          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>Upload Payment Receipt</Text>
            <TouchableOpacity style={styles.upload} onPress={pickImage}>
              <Text style={styles.uploadText}>{screenshot ? "✅ Receipt Uploaded" : "📤 Tap to Upload Screenshot"}</Text>
            </TouchableOpacity>
            {screenshot && <Image source={{ uri: screenshot }} style={styles.preview} />}
          </View>
        )}

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking}>
          <Text style={styles.confirmBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>

      {isProcessing && <AppOverlayLoader />}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Payment Details</Text>
            <Text style={styles.modalSubtitle}>Please send the amount to the following account:</Text>
            <View style={styles.modalDetailsBox}>
              {renderPaymentDetails()}
            </View>
            <Text style={styles.modalNote}>After payment, please return to the app and upload the screenshot.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 15, padding: 5, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  pageTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  summaryCard: { backgroundColor: "#fff", padding: 20, borderRadius: 16, marginBottom: 25, borderWidth: 1, borderColor: "#e0e0e0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  summaryTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#111" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 15, color: "#666" },
  summaryValue: { fontSize: 15, fontWeight: "500", color: "#111" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  totalRow: { marginTop: 5 },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#111" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#00aa88" },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10, marginTop: 10 },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  locationBox: { backgroundColor: "#e6fffa", padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#00aa88" },
  locationText: { fontSize: 13, color: "#00aa88", fontWeight: "500" },
  confirmBtn: { backgroundColor: "#111", padding: 18, borderRadius: 14, marginTop: 20, alignItems: "center" },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  paymentBox: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 20 },
  payBtn: { flex: 1, padding: 12, backgroundColor: "#f0f0f0", borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0" },
  activePay: { backgroundColor: "#00aa88", borderColor: "#00806a" },
  payText: { fontWeight: "500", color: "#555", fontSize: 12 },
  activePayText: { fontWeight: "bold", color: "#fff", fontSize: 12 },
  uploadSection: { marginBottom: 20 },
  uploadLabel: { fontSize: 14, fontWeight: "bold", color: "#555", marginBottom: 10 },
  upload: { padding: 16, backgroundColor: "#f0f0f0", borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0", borderStyle: "dashed" },
  uploadText: { fontWeight: "500", color: "#555" },
  preview: { width: 100, height: 100, marginTop: 10, borderRadius: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#111' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  modalDetailsBox: { width: '100%', backgroundColor: '#f8f9fa', padding: 20, borderRadius: 12, marginBottom: 20 },
  modalDetailTitle: { fontSize: 18, fontWeight: 'bold', color: '#00aa88', marginBottom: 10 },
  modalDetail: { fontSize: 14, color: '#555', marginBottom: 8 },
  copyBtn: { backgroundColor: '#00aa88', padding: 10, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  copyBtnText: { color: '#fff', fontWeight: 'bold' },
  modalNote: { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 20 },
  modalButtons: { width: '100%' },
  modalCloseBtn: { backgroundColor: '#eee', padding: 14, borderRadius: 10, alignItems: 'center' },
  modalCloseText: { color: '#333', fontWeight: 'bold' },
});