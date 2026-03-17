import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerText}>
              Personalize your app later with saved classes, favorites, and more.
            </Text>
          </View>

          <View style={styles.mainCard}>
            <View style={styles.settingBubble}>
              <Text style={styles.settingTitle}>Saved Preferences</Text>
              <Text style={styles.settingText}>
                Your saved options can go here later.
              </Text>
            </View>

            <View style={styles.settingBubble}>
              <Text style={styles.settingTitle}>Theme</Text>
              <Text style={styles.settingText}>
                This is where color themes could go later.
              </Text>
            </View>

            <View style={styles.settingBubble}>
              <Text style={styles.settingTitle}>Starred Classes</Text>
              <Text style={styles.settingText}>
                Students can manage favorite classes and rooms here.
              </Text>
            </View>
          </View>
        </ScrollView>

        <AIBubble />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#edf4ff",
  },

  background: {
    flex: 1,
    backgroundColor: "#edf4ff",
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 120,
  },

  headerCard: {
    backgroundColor: "#efe9ff",
    borderWidth: 2,
    borderColor: "#ddd2ff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4d3c87",
    marginBottom: 6,
  },

  headerText: {
    fontSize: 15,
    color: "#6b5c98",
    lineHeight: 22,
  },

  mainCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
  },

  settingBubble: {
    backgroundColor: "#f8f5ff",
    borderWidth: 2,
    borderColor: "#e2daf8",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },

  settingTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4d3c87",
    marginBottom: 6,
  },

  settingText: {
    fontSize: 14,
    color: "#6b5c98",
    lineHeight: 21,
  },
});