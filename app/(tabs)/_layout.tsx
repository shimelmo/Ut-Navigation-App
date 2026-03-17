import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none",
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="office-hours" />
      <Tabs.Screen name="enter-course" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}