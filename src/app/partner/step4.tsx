import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform, // ✅ Added Platform import
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PartnerStep4() {
  const router = useRouter();

  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);

  // ✅ SAFE CAMERA PICKER (Prevents crashes on Android)
  const takePhoto = async (setPhoto: (uri: string) => void) => {
    try {
      // For Android, explicitly ask for camera permission first
      if (Platform.OS === 'android') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Please allow camera access to take photos.");
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not open camera. Please try again.");
    }
  };

  const handleNext = () => {
    if (!photo1 || !photo2) {
      Alert.alert("Error", "Please take both profile photos.");
      return;
    }
    router.push("/partner/step5" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 4 of 8</Text>
      </View>

      <Text style={styles.title}>Live Profile Photos</Text>
      <Text style={styles.subtitle}>Take 2 clear photos of yourself. These will be used in your public profile after approval.</Text>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => takePhoto(setPhoto1)}>
          <Text style={styles.uploadBtnText}>📸 Take Photo 1</Text>
        </TouchableOpacity>
        {photo1 && <Image source={{ uri: photo1 }} style={styles.previewImage} />}
      </View>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => takePhoto(setPhoto2)}>
          <Text style={styles.uploadBtnText}>📸 Take Photo 2</Text>
        </TouchableOpacity>
        {photo2 && <Image source={{ uri: photo2 }} style={styles.previewImage} />}
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
  uploadRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15, gap: 10 },
  uploadBtn: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", alignItems: "center", borderStyle: "dashed" },
  uploadBtnText: { fontWeight: "600", color: "#555" },
  previewImage: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  nextBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, marginTop: 30, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});