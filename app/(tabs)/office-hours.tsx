import AIBubble from "@/components/AIBubble"; // AI button
import React from "react"; // React
import { StyleSheet, Text, View } from "react-native"; // RN components

export default function OfficeHoursScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Office Hours</Text>
        <Text style={styles.sub}>
          This is where we’ll show professor office hours by day.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Placeholder</Text>
        <Text style={styles.cardText}>
          Later we’ll add a layout like your sketch (Mon–Fri list + time box).
        </Text>

        <View style={styles.bigBox}>
          <Text style={styles.bigBoxText}>Office hours info loads here</Text>
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
    backgroundColor: "#FFF7E6", // warm accent color
    borderWidth: 1,
    borderColor: "#FDE6B8",
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

  bigBox: {
    marginTop: 14,
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  bigBoxText: {
    color: "#0B1F3B",
    fontWeight: "800",
  },
});