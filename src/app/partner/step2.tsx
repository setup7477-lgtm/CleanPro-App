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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PartnerStep2() {
  const router = useRouter();

  // State
  const [maritalStatus, setMaritalStatus] = useState<"Married" | "Unmarried" | null>(null);
  
  const [husbandName, setHusbandName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryRelation, setBeneficiaryRelation] = useState<"Father" | "Mother" | "Other Guardian" | null>(null);
  
  const [cnicFront, setCnicFront] = useState<string | null>(null);
  const [cnicBack, setCnicBack] = useState<string | null>(null);

  // ✅ SAFE IMAGE PICKER (Prevents crashes on Android)
  const pickImage = async (setImage: (uri: string) => void) => {
    try {
      // For Android, we explicitly ask for permission first
      if (Platform.OS === 'android') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Please allow access to your gallery to upload photos.");
          return;
        }
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not open gallery. Please try again.");
    }
  };

  const handleNext = () => {
    if (!maritalStatus) {
      Alert.alert("Error", "Please select your marital status.");
      return;
    }

    if (maritalStatus === "Married" && !husbandName.trim()) {
      Alert.alert("Error", "Please enter your husband's full name.");
      return;
    }

    if (maritalStatus === "Unmarried" && (!beneficiaryName.trim() || !beneficiaryRelation)) {
      Alert.alert("Error", "Please enter the beneficiary name and relationship.");
      return;
    }

    if (!cnicFront || !cnicBack) {
      Alert.alert("Error", "Please upload both Front and Back images of the CNIC.");
      return;
    }

    router.push("/partner/step3" as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 2 of 8</Text>
      </View>

      <Text style={styles.title}>Family & Documents</Text>
      <Text style={styles.subtitle}>We need this information for verification and emergency contact.</Text>

      {/* Marital Status */}
      <Text style={styles.label}>Marital Status <Text style={styles.required}>*</Text></Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.optionBtn, maritalStatus === "Married" && styles.optionActive]}
          onPress={() => setMaritalStatus("Married")}
        >
          <Text style={[styles.optionText, maritalStatus === "Married" && styles.optionTextActive]}>💍 Married</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, maritalStatus === "Unmarried" && styles.optionActive]}
          onPress={() => setMaritalStatus("Unmarried")}
        >
          <Text style={[styles.optionText, maritalStatus === "Unmarried" && styles.optionTextActive]}>📄 Unmarried</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Fields */}
      {maritalStatus === "Married" && (
        <>
          <Text style={styles.label}>Husband's Full Name <Text style={styles.required}>*</Text></Text>
          <TextInput 
            style={styles.input} 
            placeholder="Full name of husband" 
            value={husbandName} 
            onChangeText={setHusbandName} 
          />
        </>
      )}

      {maritalStatus === "Unmarried" && (
        <>
          <Text style={styles.label}>Beneficiary / Parent Full Name <Text style={styles.required}>*</Text></Text>
          <TextInput 
            style={styles.input} 
            placeholder="Full name of parent/guardian" 
            value={beneficiaryName} 
            onChangeText={setBeneficiaryName} 
          />
          <Text style={styles.label}>Relationship <Text style={styles.required}>*</Text></Text>
          <View style={styles.row}>
            {["Father", "Mother", "Other Guardian"].map((rel) => (
              <TouchableOpacity
                key={rel}
                style={[styles.optionBtn, beneficiaryRelation === rel && styles.optionActive]}
                onPress={() => setBeneficiaryRelation(rel as any)}
              >
                <Text style={[styles.optionText, beneficiaryRelation === rel && styles.optionTextActive]}>{rel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* CNIC Upload Section */}
      <Text style={styles.sectionHeader}>Partner's Identity Document (CNIC)</Text>
      <Text style={styles.sectionSub}>Please upload clear photos of your CNIC. Only the Admin will see this.</Text>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(setCnicFront)}>
          <Text style={styles.uploadBtnText}>📸 Upload Front</Text>
        </TouchableOpacity>
        {cnicFront && <Image source={{ uri: cnicFront }} style={styles.previewImage} />}
      </View>

      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(setCnicBack)}>
          <Text style={styles.uploadBtnText}>📸 Upload Back</Text>
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
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 15, marginBottom: 5 },
  required: { color: "#dc2626" },
  input: { backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e0e0e0", fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10, flexWrap: "wrap" },
  optionBtn: { flex: 1, padding: 14, backgroundColor: "#fff", borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0", minWidth: 80 },
  optionActive: { borderColor: "#00aa88", backgroundColor: "#f0fdfa" },
  optionText: { fontSize: 16, fontWeight: "500", color: "#555" },
  optionTextActive: { color: "#00aa88" },
  
  sectionHeader: { fontSize: 20, fontWeight: "bold", color: "#111", marginTop: 25, marginBottom: 5 },
  sectionSub: { fontSize: 14, color: "#666", marginBottom: 15 },
  uploadRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15, gap: 10 },
  uploadBtn: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", alignItems: "center", borderStyle: "dashed" },
  uploadBtnText: { fontWeight: "600", color: "#555" },
  previewImage: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  nextBtn: { backgroundColor: "#00aa88", padding: 18, borderRadius: 14, marginTop: 30, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});