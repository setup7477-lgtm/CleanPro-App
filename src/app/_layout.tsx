import { Tabs } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import AppOverlayLoader from "../components/AppOverlayLoader";
import { AvailabilityProvider } from "./context/AvailabilityContext";
import { auth } from "./firebase";

// 👇 We import the Login UI from Profile to use it here
import ProfileScreen from "./profile";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Listen to Auth State (Checks if user is logged in)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Stop showing splash screen once we know
    });
    return unsubscribe;
  }, []);

  // 2. Show Splash Loader while checking auth
  if (isLoading) {
    return <AppOverlayLoader />;
  }

  // 3. If NOT logged in, show the Login/Create Account screen ONLY
  if (!user) {
    return <ProfileScreen />;
  }

  // 4. If LOGGED IN, show the Main App with Tabs
  return (
    <AvailabilityProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            paddingBottom: 5,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
          },
          tabBarActiveTintColor: "#00aa88",
          tabBarInactiveTintColor: "#888",
        }}
      >
        {/* --- 1. HOME TAB --- */}
        <Tabs.Screen 
          name="index" 
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
          }} 
        />

        {/* --- 2. EXPLORE TAB --- */}
        <Tabs.Screen 
          name="explore" 
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🔍</Text>,
          }} 
        />

        {/* --- 3. BOOKINGS TAB --- */}
        <Tabs.Screen 
          name="my-bookings" 
          options={{
            title: "Bookings",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📋</Text>,
          }} 
        />

        {/* --- 4. PROFILE TAB --- */}
        <Tabs.Screen 
          name="profile" 
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
          }} 
        />

        {/* --- HIDDEN SCREENS (These are never shown in the footer) --- */}
        <Tabs.Screen name="home-cleaning" options={{ href: null }} />
        <Tabs.Screen name="deep-cleaning" options={{ href: null }} />
        <Tabs.Screen name="office-cleaning" options={{ href: null }} />
        <Tabs.Screen name="booking" options={{ href: null }} />
        <Tabs.Screen name="cleaner-profile" options={{ href: null }} />
        <Tabs.Screen name="_components" options={{ href: null }} />
      </Tabs>
    </AvailabilityProvider>
  );
}