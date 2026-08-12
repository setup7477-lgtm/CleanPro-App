import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ ADD THIS
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbUldzMUX_7dzaH7Aa9E4QYHn4qM6KMIU",
  authDomain: "cleaner-app-a06fc.firebaseapp.com",
  projectId: "cleaner-app-a06fc",
  storageBucket: "cleaner-app-a06fc.firebasestorage.app",
  messagingSenderId: "954165084411",
  appId: "1:954165084411:web:da9c7edc39d4204058705e",
  measurementId: "G-QF6WV6M0VV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ EXPORT THIS