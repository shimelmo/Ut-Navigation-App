import AIBubble from "@/components/AIBubble"; // AI button
import React from "react"; // React
import { StyleSheet, Text, View } from "react-native"; // RN

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.sub}>
          Later we can add theme options + clear saved courses, etc.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Placeholder</Text>
        <Text style={styles.cardText}>
          Nothing to change yet, but this page is ready for later.
        </Text>

        <View style={styles.box}>
          <Text style={styles.boxText}>Settings options will go here</Text>
        </View>
      </View>

      <AIBubble />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    padding: 14,
  },

  header: {
    backgroundColor: "#F1ECFF", // soft purple for variety
    borderWidth: 1,
    borderColor: "#DCD2FF",
    borderRadius: 18,
    padding: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0B1F3B",
  },

  sub: {
    marginTop: 6,
    color: "#374151",
    fontWeight: "600",
  },

  card: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 14,
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },

  cardText: {
    marginTop: 6,
    color: "#6B7280",
    lineHeight: 20,
  },

  box: {
    marginTop: 14,
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF7E6",
    alignItems: "center",
    justifyContent: "center",
  },

  boxText: {
    color: "#0B1F3B",
    fontWeight: "800",
  },
});