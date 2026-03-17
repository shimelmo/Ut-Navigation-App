import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import database from "@/data/database.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type DatabaseCourse = {
  professor: string;
  professorFirstName: string;
  professorLastName: string;
  professorFullName: string;
  courseNumber: string;
  subject: string;
  section: string;
  room: string;
  building: string;
  days: string[];
  beginTime: string;
  endTime: string;
};

type SavedCourse = {
  id: string;
  subject: string;
  courseNumber: string;
  professor: string;
  professorFullName: string;
  room: string;
  building: string;
  days: string[];
  beginTime: string;
  endTime: string;
  section: string;
};

const STORAGE_KEY = "saved_courses";
const LAST_SELECTED_PROFESSOR_KEY = "last_selected_professor";

function cleanProfessorName(name: string) {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\bdr\b/g, "")
    .replace(/\bprof\b/g, "")
    .replace(/\bprofessor\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getLastName(name: string) {
  const cleaned = cleanProfessorName(name);
  const parts = cleaned.split(" ").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

export default function EnterCourseScreen() {
  const [professor, setProfessor] = useState("");
  const [course, setCourse] = useState("");
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [matchingSections, setMatchingSections] = useState<DatabaseCourse[]>([]);

  useEffect(() => {
    loadSavedCourses();
  }, []);

  useEffect(() => {
    saveSavedCourses(savedCourses);
  }, [savedCourses]);

  const loadSavedCourses = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCourses) {
        setSavedCourses(JSON.parse(storedCourses));
      }
    } catch (error) {
      console.log("Could not load saved courses:", error);
    }
  };

  const saveSavedCourses = async (coursesToSave: SavedCourse[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(coursesToSave));
    } catch (error) {
      console.log("Could not save courses:", error);
    }
  };

  const cleanText = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/\s+/g, " ");
  };

  const professorMatches = (dbCourse: DatabaseCourse, professorInput: string) => {
    const input = cleanProfessorName(professorInput);

    const lastName = cleanProfessorName(dbCourse.professorLastName || "");
    const fullName = cleanProfessorName(dbCourse.professorFullName || "");
    const shortProfessor = cleanProfessorName(dbCourse.professor || "");

    return (
      input === lastName ||
      input === fullName ||
      input === shortProfessor ||
      fullName.includes(input) ||
      lastName.includes(input)
    );
  };

  const courseMatches = (dbCourse: DatabaseCourse, courseInput: string) => {
    const input = cleanText(courseInput);

    const numberOnly = cleanText(dbCourse.courseNumber || "");
    const subjectOnly = cleanText(dbCourse.subject || "");
    const subjectAndNumber = cleanText(`${dbCourse.subject} ${dbCourse.courseNumber}`);
    const subjectAndNumberNoSpace = cleanText(`${dbCourse.subject}${dbCourse.courseNumber}`);

    return (
      input === numberOnly ||
      input === subjectOnly ||
      input === subjectAndNumber ||
      input === subjectAndNumberNoSpace
    );
  };

  const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return "No days listed";
    return days.join(", ");
  };

  const formatTime = (time: string) => {
    if (!time || time.length < 3) return time;

    const clean = time.padStart(4, "0");
    const hour = parseInt(clean.slice(0, 2), 10);
    const minute = clean.slice(2);

    const amOrPm = hour >= 12 ? "PM" : "AM";
    const convertedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${convertedHour}:${minute} ${amOrPm}`;
  };

  const uniqueProfessorSuggestions = useMemo(() => {
    const typed = cleanProfessorName(professor);

    if (typed === "") return [];

    const foundNames = new Map<string, string>();

    (database as DatabaseCourse[]).forEach((item) => {
      const fullName = item.professorFullName?.trim();
      const lastName = item.professorLastName?.trim();
      const shortName = item.professor?.trim();

      if (!fullName) return;

      const fullNameClean = cleanProfessorName(fullName);
      const lastNameClean = cleanProfessorName(lastName || "");
      const shortNameClean = cleanProfessorName(shortName || "");

      const matches =
        fullNameClean.includes(typed) ||
        lastNameClean.includes(typed) ||
        shortNameClean.includes(typed) ||
        typed === getLastName(fullName);

      if (matches && !foundNames.has(fullName)) {
        foundNames.set(fullName, fullName);
      }
    });

    return Array.from(foundNames.values()).sort((a, b) => {
      const aFull = cleanProfessorName(a);
      const bFull = cleanProfessorName(b);
      const aLast = getLastName(a);
      const bLast = getLastName(b);

      const aStarts =
        aFull.startsWith(typed) || aLast.startsWith(typed) ? 0 : 1;
      const bStarts =
        bFull.startsWith(typed) || bLast.startsWith(typed) ? 0 : 1;

      if (aStarts !== bStarts) return aStarts - bStarts;

      return a.localeCompare(b);
    });
  }, [professor]);

  const saveChosenCourse = async (foundCourse: DatabaseCourse) => {
    const newCourse: SavedCourse = {
      id: `${foundCourse.subject}-${foundCourse.courseNumber}-${foundCourse.section}-${foundCourse.professorLastName}`,
      subject: foundCourse.subject,
      courseNumber: foundCourse.courseNumber,
      professor: foundCourse.professor,
      professorFullName: foundCourse.professorFullName,
      room: foundCourse.room,
      building: foundCourse.building,
      days: foundCourse.days,
      beginTime: foundCourse.beginTime,
      endTime: foundCourse.endTime,
      section: foundCourse.section,
    };

    const alreadySaved = savedCourses.some((item) => item.id === newCourse.id);

    if (alreadySaved) {
      Alert.alert("Already Saved", "That section is already in your saved courses.");
      return;
    }

    const updatedCourses = [...savedCourses, newCourse];
    setSavedCourses(updatedCourses);

    try {
      await AsyncStorage.setItem(
        LAST_SELECTED_PROFESSOR_KEY,
        foundCourse.professorFullName ||
          foundCourse.professorLastName ||
          foundCourse.professor
      );
    } catch (error) {
      console.log("Could not save last selected professor:", error);
    }

    setMatchingSections([]);
    setProfessor("");
    setCourse("");
  };

  const addCourse = () => {
    if (professor.trim() === "" || course.trim() === "") {
      Alert.alert("Missing Info", "Please enter both professor and course.");
      return;
    }

    const foundCourses = (database as DatabaseCourse[]).filter((item) => {
      return professorMatches(item, professor) && courseMatches(item, course);
    });

    if (foundCourses.length === 0) {
      Alert.alert(
        "Course Not Found",
        "We could not find that class. Try the professor's last name or full name, and enter the course like CSET 3200 or just 3200."
      );
      setMatchingSections([]);
      return;
    }

    if (foundCourses.length === 1) {
      saveChosenCourse(foundCourses[0]);
      return;
    }

    setMatchingSections(foundCourses);
  };

  const deleteCourse = async (id: string) => {
    const updatedCourses = savedCourses.filter((item) => item.id !== id);
    setSavedCourses(updatedCourses);

    if (updatedCourses.length === 0) {
      try {
        await AsyncStorage.removeItem(LAST_SELECTED_PROFESSOR_KEY);
      } catch (error) {
        console.log("Could not remove last selected professor:", error);
      }
    }
  };

  const chooseProfessorFromDropdown = (name: string) => {
    setProfessor(name);
    setMatchingSections([]);
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
              placeholder="Enter professor last name or full name"
              placeholderTextColor="#7f90aa"
              value={professor}
              onChangeText={setProfessor}
            />

            {professor.trim() !== "" &&
              uniqueProfessorSuggestions.length > 0 &&
              !uniqueProfessorSuggestions.some(
                (name) => cleanProfessorName(name) === cleanProfessorName(professor)
              ) && (
                <View style={styles.searchResultsCard}>
                  {uniqueProfessorSuggestions.slice(0, 8).map((name) => (
                    <Pressable
                      key={name}
                      style={styles.searchResultButton}
                      onPress={() => chooseProfessorFromDropdown(name)}
                    >
                      <Text style={styles.searchResultText}>{name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

            <Text style={styles.label}>Course Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter CSET 3200 or 3200"
              placeholderTextColor="#7f90aa"
              value={course}
              onChangeText={setCourse}
            />

            <Pressable style={styles.addButton} onPress={addCourse}>
              <Text style={styles.addButtonText}>Add Course</Text>
            </Pressable>

            {matchingSections.length > 1 && (
              <>
                <Text style={styles.sectionTitle}>Choose a Section</Text>

                {matchingSections.map((item) => (
                  <Pressable
                    key={`${item.subject}-${item.courseNumber}-${item.section}-${item.beginTime}`}
                    style={styles.matchCard}
                    onPress={() => saveChosenCourse(item)}
                  >
                    <Text style={styles.matchTitle}>
                      {item.subject} {item.courseNumber} - Section {item.section}
                    </Text>

                    <Text style={styles.matchText}>
                      Professor: {item.professorFullName}
                    </Text>

                    <Text style={styles.matchText}>
                      Building: {item.building}
                    </Text>

                    <Text style={styles.matchText}>Room: {item.room}</Text>

                    <Text style={styles.matchText}>
                      Days: {formatDays(item.days)}
                    </Text>

                    <Text style={styles.matchText}>
                      Time: {formatTime(item.beginTime)} - {formatTime(item.endTime)}
                    </Text>

                    <Text style={styles.tapText}>Tap to save this section</Text>
                  </Pressable>
                ))}
              </>
            )}

            <Text style={styles.sectionTitle}>Saved Courses</Text>

            {savedCourses.length === 0 ? (
              <View style={styles.courseCard}>
                <Text style={styles.courseText}>No saved courses yet.</Text>
              </View>
            ) : (
              savedCourses.map((item) => (
                <View key={item.id} style={styles.courseCard}>
                  <Text style={styles.courseTitle}>
                    {item.subject} {item.courseNumber}
                  </Text>

                  <Text style={styles.courseText}>Section: {item.section}</Text>

                  <Text style={styles.courseText}>
                    Professor: {item.professorFullName}
                  </Text>

                  <Text style={styles.courseText}>
                    Building: {item.building}
                  </Text>

                  <Text style={styles.courseText}>Room: {item.room}</Text>

                  <Text style={styles.courseText}>
                    Days: {formatDays(item.days)}
                  </Text>

                  <Text style={styles.courseText}>
                    Time: {formatTime(item.beginTime)} - {formatTime(item.endTime)}
                  </Text>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => deleteCourse(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Pressable>
                </View>
              ))
            )}
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
    marginBottom: 12,
    color: "#183a6b",
  },

  searchResultsCard: {
    backgroundColor: "#f7faff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
  },

  searchResultButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e3ecfa",
  },

  searchResultText: {
    fontSize: 15,
    color: "#234a84",
    fontWeight: "600",
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
    marginTop: 8,
  },

  matchCard: {
    backgroundColor: "#eef5ff",
    borderWidth: 2,
    borderColor: "#bfd6ff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },

  matchTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 6,
  },

  matchText: {
    fontSize: 14,
    color: "#35527d",
    marginBottom: 2,
  },

  tapText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#234a84",
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

  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#ffe2e2",
    borderWidth: 1.5,
    borderColor: "#d98b8b",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  deleteButtonText: {
    color: "#8b3a3a",
    fontWeight: "700",
    fontSize: 13,
  },
});