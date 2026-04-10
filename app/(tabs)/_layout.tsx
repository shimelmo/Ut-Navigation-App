// Import the Tabs component from Expo Router.
// This is used to create tab-based navigation between screens.
import { Tabs } from "expo-router";

// Main layout component for tab navigation.
// This controls which pages exist in your bottom tab navigator.
export default function TabsLayout() {
  return (
    // Tabs container holds all tab screens
    <Tabs
      screenOptions={{
        // Hide the default top header bar on every screen
        headerShown: false,

        // Hide the actual bottom tab bar UI
        // This means navigation still works,
        // but users won't see the normal tab buttons.
        // You are using your own custom navigation instead (TopTabs.tsx)
        tabBarStyle: {
          display: "none",
        },
      }}
    >
      {/* Main home screen */}
      <Tabs.Screen name="index" />

      {/* Office hours page */}
      <Tabs.Screen name="office-hours" />

      {/* Enter course page where users save classes */}
      <Tabs.Screen name="enter-course" />

      {/* Settings page */}
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}