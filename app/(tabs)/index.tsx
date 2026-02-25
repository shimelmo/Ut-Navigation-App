import AIBubble from "@/components/AIBubble"; // AI floating button
import React from "react"; // React
import { StyleSheet, Text, View } from "react-native"; // RN components

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      {/* fun header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UT Navigation App</Text>
        <Text style={styles.headerSub}>
          This is the home map page (placeholder for now).
        </Text>
      </View>

      {/* main card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Map Display</Text>
        <Text style={styles.cardText}>
          Right now this is just a blank map area. Later we’ll put the actual
          North Engineering layout here and mark rooms.
        </Text>

        {/* big placeholder box */}
        <View style={styles.mapBox}>
          <Text style={styles.mapText}>DISPLAY</Text>
        </View>

        {/* mini note */}
        <Text style={styles.note}>
          ⭐ Later: show your location + starred classes
        </Text>
      </View>

      {/* AI bubble on this page */}
      <AIBubble />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // full height
    backgroundColor: "#F7F7FB", // soft light background
    padding: 14, // spacing
  },

  header: {
    backgroundColor: "#EAF2FF", // soft blue
    borderWidth: 1, // border
    borderColor: "#CFE2FF",
    borderRadius: 18, // rounded
    padding: 14,
  },

  headerTitle: {
    fontSize: 20, // bigger title
    fontWeight: "900", // bold
    color: "#0B1F3B", // navy
  },

  headerSub: {
    marginTop: 6, // spacing
    color: "#374151", // gray
    fontWeight: "600",
  },

  card: {
    marginTop: 12, // spacing from header
    backgroundColor: "#FFFFFF", // white card
    borderWidth: 1, // border
    borderColor: "#E5E7EB",
    borderRadius: 18, // rounded
    padding: 14,
    flex: 1, // fill space
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  cardText: {
    marginTop: 6,
    color: "#6B7280",
    lineHeight: 20,
  },

  mapBox: {
    marginTop: 14,
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF7E6", // soft warm color (fun)
    alignItems: "center",
    justifyContent: "center",
  },

  mapText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0B1F3B",
    opacity: 0.3,
    letterSpacing: 1,
  },

  note: {
    marginTop: 10,
    color: "#0B1F3B",
    fontWeight: "700",
  },
});