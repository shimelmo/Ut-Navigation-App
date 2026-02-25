import { Tabs } from "expo-router"; // Tabs navigation from expo-router
import React from "react"; // React is needed for components

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // no ugly header bar on top
        tabBarStyle: {
          backgroundColor: "#ffffff", // clean white tab bar
          borderTopColor: "#E5E7EB", // light border line
          height: 62, // a little taller (looks nicer)
          paddingBottom: 8, // spacing
        },
        tabBarActiveTintColor: "#0B1F3B", // UT navy (not too much)
        tabBarInactiveTintColor: "#6B7280", // gray for inactive tabs
        tabBarLabelStyle: {
          fontSize: 12, // small and simple
          fontWeight: "700", // bold-ish
        },
      }}
    >
      <Tabs.Screen
        name="index" // this file is app/(tabs)/index.tsx
        options={{ title: "Home" }} // label on tab bar
      />

      <Tabs.Screen
        name="office-hours" // app/(tabs)/office-hours.tsx
        options={{ title: "Office Hours" }}
      />

      <Tabs.Screen
        name="enter-course" // app/(tabs)/enter-course.tsx
        options={{ title: "Enter Course" }}
      />

      <Tabs.Screen
        name="settings" // app/(tabs)/settings.tsx
        options={{ title: "Settings" }}
      />
    </Tabs>
  );
}