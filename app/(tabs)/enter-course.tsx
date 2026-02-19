import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";


export default function EnterCourseScreen() {
  const [prof, setProf] = useState("");
  const [course, setCourse] = useState("");
  const [room, setRoom] = useState("");


  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Enter Course</Text>
      </View>


      <View style={styles.card}>
        <Text style={styles.label}>Professor name</Text>
        <TextInput
          value={prof}
          onChangeText={setProf}
          placeholder="e.g., Dr. Smith"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />


        <Text style={[styles.label, { marginTop: 10 }]}>Course name / #</Text>
        <TextInput
          value={course}
          onChangeText={setCourse}
          placeholder="e.g., CSET 4250"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />


        <Text style={[styles.label, { marginTop: 10 }]}>Location / room #</Text>
        <TextInput
          value={room}
          onChangeText={setRoom}
          placeholder="e.g., North Eng 1010"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />


        <Pressable style={styles.saveBtn} onPress={() => {}}>
          <Text style={styles.saveBtnText}>Save (placeholder)</Text>
        </Pressable>


        <Text style={styles.note}>
          Next: we’ll store these in local storage + show a list/table like your
          sketch.
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
  gold: "#C9A227",
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
  label: { color: COLORS.text, fontWeight: "800", fontSize: 13 },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    backgroundColor: "#FFFFFF",
  },
  saveBtn: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: COLORS.navy,
    borderWidth: 2,
    borderColor: COLORS.gold, // small gold accent
  },
  saveBtnText: { color: "#FFFFFF", fontWeight: "900" },
  note: { marginTop: 10, color: COLORS.muted, lineHeight: 20 },
});
