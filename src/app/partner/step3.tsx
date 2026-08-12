import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PartnerStep3() {
  const router = useRouter();

  const [cnicFront, setCnicFront] = useState<string | null>(null);
  const [cnicBack, setCnicBack] = useState<string | null>(null);

  const pickImage = async (setImage: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (!cnicFront || !cnicBack) {
      Alert.alert("Error", "Please upload both Front and Back images of your CNIC.");
      return;
    }
    router.push("/partner/step4" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 3 of 8</Text>
      </View>

      <Text style={styles.title}>Identity Document</Text>
      <Text style={styles.subtitle}>Please upload clear photos of your own CNIC for verification.</Text>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(setCnicFront)}>
          <Text style={styles.uploadBtnText}>📸 Upload CNIC Front</Text>
        </TouchableOpacity>
        {cnicFront && <Image source={{ uri: cnicFront }} style={styles.previewImage} />}
      </View>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(setCnicBack)}>
          <Text style={styles.uploadBtnText}>📸 Upload CNIC Back</Text>
        </TouchableOpacity>
        {cnicBack && <Image source={{ uri: cnicBack }} style={styles.previewImage} />}
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