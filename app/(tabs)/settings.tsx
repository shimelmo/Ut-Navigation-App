import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>


      <View style={styles.card}>
        <Text style={styles.h1}>Settings (placeholder)</Text>
        <Text style={styles.p}>
          Later: theme toggle, saved courses, reset data, etc.
        </Text>
      </View>
    </View>
  );
}


const COLORS = {
  bg: "#F7F7F8",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  navy: "#0B1F3B",
};


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg, padding: 14 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EEF2F7",
    borderRadius: 10,
  },
  backText: { color: COLORS.text, fontWeight: "800" },
  title: { fontSize: 18, fontWeight: "900", color: COLORS.navy },


  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
  },
  h1: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  p: { marginTop: 8, color: COLORS.muted, lineHeight: 20 },
});
