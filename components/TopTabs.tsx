import {
  appThemes,
  defaultSettings,
  UserSettings,
} from "@/utils/appSettings";
import { router, usePathname } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TopTabsProps = {
  settings?: UserSettings;
};

export default function TopTabs({ settings = defaultSettings }: TopTabsProps) {
  const pathname = usePathname();
  const theme = settings.darkMode ? appThemes.dark : appThemes.light;

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Office Hours", path: "/office-hours" },
    { label: "Enter Course", path: "/enter-course" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.screenBg,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;

        return (
          <Pressable
            key={tab.path}
            onPress={() => router.push(tab.path as any)}
            style={[
              styles.tab,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
              isActive && {
                backgroundColor: theme.buttonBg,
                borderColor: theme.buttonBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive ? theme.buttonText : theme.title,
                },
                isActive && styles.activeTabText,
              ]}
            >
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
    paddingTop: 8,
  },

  tab: {
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 140,
    alignItems: "center",
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },

  activeTabText: {
    fontWeight: "800",
  },
});