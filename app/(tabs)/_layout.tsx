import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="office-hours"
        options={{
          title: "Office Hours",
        }}
      />
      <Tabs.Screen
        name="enter-course"
        options={{
          title: "Enter Course",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />

      {/* ✅ No Explore tab */}
    </Tabs>
  );
}