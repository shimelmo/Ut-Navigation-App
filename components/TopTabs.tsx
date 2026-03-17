import { router, usePathname } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TopTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Office Hours", path: "/office-hours" },
    { label: "Enter Course", path: "/enter-course" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;

        return (
          <Pressable
            key={tab.path}
            onPress={() => router.push(tab.path as any)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 18,
    backgroundColor: "#edf4ff",
    paddingTop: 8,
  },
  tab: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d7e3f7",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 140,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#dcecff",
    borderColor: "#234a84",
  },
  tabText: {
    color: "#234a84",
    fontSize: 15,
    fontWeight: "600",
  },
  activeTabText: {
    fontWeight: "800",
  },
});