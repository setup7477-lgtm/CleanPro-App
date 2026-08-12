import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); 

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ bookings: 0, spent: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadProfileData(currentUser.uid);
        await loadUserStats(currentUser.uid);
      } else {
        setUser(null);
        setName("");
        setPhone("");
        setAddress("");
        setStats({ bookings: 0, spent: 0 });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loadProfileData = async (uid: string) => {
    try {
      const docRef = doc(db, "customers", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      } else {
        await setDoc(docRef, { name: "", phone: "", address: "" });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadUserStats = async (uid: string) => {
    try {
      const q = query(collection(db, "bookings"), where("customerId", "==", uid));
      const querySnapshot = await getDocs(q);
      let totalSpent = 0;
      const totalBookings = querySnapshot.size;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalSpent += (data.price || 0);
      });
      setStats({ bookings: totalBookings, spent: totalSpent });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleAuth = async () => {
    if (!authEmail || !authPassword) {
      Alert.alert("Error", "Please fill in email and password.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        await setDoc(doc(db, "customers", userCredential.user.uid), {
          name: "",
          phone: "",
          address: "",
        });
      }
      setAuthEmail("");
      setAuthPassword("");
    } catch (error: any) {
      Alert.alert("Auth Error", error.message);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
        },
      },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "customers", user.uid);
      await updateDoc(docRef, {
        name: name,
        phone: phone,
        address: address,
      });
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00aa88" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // IF NOT LOGGED IN: Render Login Screen (Used by _layout.tsx)
  if (!user) {
    return (
      <ScrollView contentContainerStyle={styles.authContainer}>
        <View style={styles.authHeader}>
          <Text style={styles.logoIcon}>🧹</Text>
          <Text style={styles.authTitle}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
          <Text style={styles.authSubtitle}>
            {isLogin ? "Sign in to manage your bookings" : "Join CleanPro today"}
          </Text>
        </View>

        <TextInput
          style={styles.authInput}
          placeholder="Email Address"
          value={authEmail}
          onChangeText={setAuthEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.authInput}
          placeholder="Password"
          value={authPassword}
          onChangeText={setAuthPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
          <Text style={styles.authButtonText}>{isLogin ? "Sign In" : "Create Account"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchAuthText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // IF LOGGED IN: Render Profile Dashboard
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: "https://i.pravatar.cc/150?img=68" }} style={styles.avatar} />
        <Text style={styles.headerName}>{name || "Customer"}</Text>
        <Text style={styles.headerSub}>{user?.email || "No Email"}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.bookings}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>Rs {stats.spent.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>⭐ {stats.bookings > 0 ? "4.9" : "0.0"}</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>
        <View style={styles.divider} />

        {isEditing ? (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
            <Text style={styles.label}>Saved Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" />

            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.saveBtn, saving && styles.disabledBtn]} onPress={handleSaveProfile} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save Changes"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{name || "Not set"}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{phone || "Not set"}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Saved Address</Text>
              <Text style={styles.infoValue}>{address || "Not set"}</Text>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  authContainer: { flexGrow: 1, padding: 30, backgroundColor: "#f8f9fa", justifyContent: "center" },
  authHeader: { alignItems: 'center', marginBottom: 30 },
  logoIcon: { fontSize: 60, marginBottom: 10 },
  authTitle: { fontSize: 28, fontWeight: "bold", color: "#111", marginBottom: 5 },
  authSubtitle: { fontSize: 16, color: "#666" },
  authInput: { backgroundColor: "#fff", padding: 15, borderRadius: 12, borderWidth: 1, borderColor: "#e0e0e0", marginBottom: 15, fontSize: 16 },
  authButton: { backgroundColor: "#111", padding: 18, borderRadius: 12, alignItems: "center", marginTop: 10 },
  authButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  switchAuthText: { textAlign: 'center', marginTop: 15, color: "#00aa88", fontWeight: "600" },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f8f9fa" },
  loadingText: { marginTop: 10, color: "#666" },

  container: { padding: 20, backgroundColor: "#f8f9fa", paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 25 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#00aa88", marginBottom: 10 },
  headerName: { fontSize: 24, fontWeight: "bold", color: "#111" },
  headerSub: { fontSize: 16, color: "#666" },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, gap: 10 },
  statCard: { flex: 1, backgroundColor: "#fff", padding: 15, borderRadius: 14, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#111" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },

  card: { backgroundColor: "#fff", padding: 20, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#111" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  infoLabel: { fontSize: 15, color: "#666" },
  infoValue: { fontSize: 15, fontWeight: "500", color: "#111" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 4 },
  editBtn: { backgroundColor: "#111", padding: 14, borderRadius: 12, marginTop: 20, alignItems: "center" },
  editBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  label: { fontSize: 14, color: "#666", marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: "#f5f7fb", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 10 },
  saveBtn: { flex: 1, backgroundColor: "#00aa88", padding: 14, borderRadius: 12, alignItems: "center" },
  disabledBtn: { opacity: 0.7 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: { flex: 1, backgroundColor: "#eee", padding: 14, borderRadius: 12, alignItems: "center" },
  cancelBtnText: { color: "#555", fontWeight: "bold", fontSize: 16 },

  logoutBtn: { backgroundColor: "#fee2e2", padding: 16, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#fecaca" },
  logoutBtnText: { color: "#dc2626", fontWeight: "bold", fontSize: 16 },
});