import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EnterCourseScreen() {
  const [professor, setProfessor] = useState("");
  const [course, setCourse] = useState("");

  const [savedCourses, setSavedCourses] = useState([
    { id: 1, course: "CSET 3200", professor: "Dr. Smith", room: "NE 1300" },
    { id: 2, course: "CSET 3600", professor: "Prof. Adams", room: "NE 1200" },
  ]);

  const addCourse = () => {
    if (professor.trim() === "" || course.trim() === "") return;

    const newCourse = {
      id: Date.now(),
      course: course,
      professor: professor,
      room: "Room TBD",
    };

    setSavedCourses([...savedCourses, newCourse]);
    setProfessor("");
    setCourse("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Enter Courses</Text>
            <Text style={styles.headerText}>
              Add your class info so the map can load what matters to you.
            </Text>
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.label}>Professor Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter professor name"
              placeholderTextColor="#7f90aa"
              value={professor}
              onChangeText={setProfessor}
            />

            <Text style={styles.label}>Course Name / Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter course name or number"
              placeholderTextColor="#7f90aa"
              value={course}
              onChangeText={setCourse}
            />

            <Pressable style={styles.addButton} onPress={addCourse}>
              <Text style={styles.addButtonText}>Add Course</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Saved Courses</Text>

            {savedCourses.map((item) => (
              <View key={item.id} style={styles.courseCard}>
                <Text style={styles.courseTitle}>{item.course}</Text>
                <Text style={styles.courseText}>Professor: {item.professor}</Text>
                <Text style={styles.courseText}>Room: {item.room}</Text>
              </View>
            ))}
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
    backgroundColor: "#ffeef4",
    borderWidth: 2,
    borderColor: "#f4d4e1",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#7a2e58",
    marginBottom: 6,
  },

  headerText: {
    fontSize: 15,
    color: "#8b4f71",
    lineHeight: 22,
  },

  mainCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#183a6b",
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    backgroundColor: "#f7faff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
    color: "#183a6b",
  },

  addButton: {
    backgroundColor: "#dcecff",
    borderWidth: 2,
    borderColor: "#234a84",
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },

  addButtonText: {
    color: "#183a6b",
    fontSize: 16,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 12,
  },

  courseCard: {
    backgroundColor: "#fff9eb",
    borderWidth: 2,
    borderColor: "#f1e2b5",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#5d4c16",
    marginBottom: 6,
  },

  courseText: {
    fontSize: 14,
    color: "#735f22",
    marginBottom: 2,
  },
});