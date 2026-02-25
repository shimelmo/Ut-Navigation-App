import AIBubble from "@/components/AIBubble"; // AI button
import React, { useState } from "react"; // React + state
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"; // RN

export default function EnterCourseScreen() {
  const [prof, setProf] = useState(""); // professor input
  const [course, setCourse] = useState(""); // course input
  const [room, setRoom] = useState(""); // room input

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter Course</Text>
        <Text style={styles.sub}>
          Put in your class info (later we’ll save it and show it on the map).
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Professor name</Text>
        <TextInput
          value={prof}
          onChangeText={setProf}
          placeholder="Example: Dr. Smith"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        <Text style={styles.label}>Course name / #</Text>
        <TextInput
          value={course}
          onChangeText={setCourse}
          placeholder="Example: CSET 3300"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        <Text style={styles.label}>Room / location</Text>
        <TextInput
          value={room}
          onChangeText={setRoom}
          placeholder="Example: North Eng 1010"
          placeholderTextColor="#6B7280"
          style={styles.input}
        />

        {/* button doesn't save yet, just looks nice */}
        <Pressable style={styles.btn} onPress={() => {}}>
          <Text style={styles.btnText}>Save (not working yet)</Text>
        </Pressable>

        <Text style={styles.note}>
          Next: we’ll add a table below this with saved courses like your UI
          sketch.
        </Text>
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
    backgroundColor: "#EAFBF2", // soft green-ish for variety
    borderWidth: 1,
    borderColor: "#CFF5DF",
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

  label: {
    marginTop: 10,
    fontWeight: "800",
    color: "#111827",
  },

  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },

  btn: {
    marginTop: 14,
    backgroundColor: "#0B1F3B",
    borderWidth: 2,
    borderColor: "#C9A227",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "900",
  },

  note: {
    marginTop: 10,
    color: "#6B7280",
    lineHeight: 20,
  },
});