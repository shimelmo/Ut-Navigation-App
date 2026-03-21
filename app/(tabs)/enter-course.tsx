import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import database from "@/data/database.json";
import { getCourseDayColorSet } from "@/utils/courseColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

type CourseSuggestion = {
  label: string;
  subject: string;
  courseNumber: string;
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

function cleanText(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ");
}

function normalizeCourseInput(text: string) {
  return cleanText(text).replace(/\s+/g, "");
}

function courseDisplay(subject: string, courseNumber: string) {
  return `${subject} ${courseNumber}`;
}

export default function EnterCourseScreen() {
  const [professor, setProfessor] = useState("");
  const [course, setCourse] = useState("");
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [matchingSections, setMatchingSections] = useState<DatabaseCourse[]>([]);

  const loadSavedCourses = useCallback(async () => {
    try {
      const storedCourses = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCourses) {
        setSavedCourses(JSON.parse(storedCourses));
      } else {
        setSavedCourses([]);
      }
    } catch (error) {
      console.log("Could not load saved courses:", error);
    }
  }, []);

  useEffect(() => {
    loadSavedCourses();
  }, [loadSavedCourses]);

  useFocusEffect(
    useCallback(() => {
      loadSavedCourses();
    }, [loadSavedCourses])
  );

  useEffect(() => {
    const saveSavedCourses = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedCourses));
      } catch (error) {
        console.log("Could not save courses:", error);
      }
    };

    saveSavedCourses();
  }, [savedCourses]);

  const professorMatches = (dbCourse: DatabaseCourse, professorInput: string) => {
    const input = cleanProfessorName(professorInput);

    if (input === "") return true;

    const lastName = cleanProfessorName(dbCourse.professorLastName || "");
    const fullName = cleanProfessorName(dbCourse.professorFullName || "");
    const shortProfessor = cleanProfessorName(dbCourse.professor || "");

    return (
      input === lastName ||
      input === fullName ||
      input === shortProfessor ||
      fullName.includes(input) ||
      lastName.includes(input) ||
      shortProfessor.includes(input)
    );
  };

  const courseMatches = (dbCourse: DatabaseCourse, courseInput: string) => {
    const input = cleanText(courseInput);
    const inputNoSpace = normalizeCourseInput(courseInput);

    if (input === "") return true;

    const numberOnly = cleanText(dbCourse.courseNumber || "");
    const subjectOnly = cleanText(dbCourse.subject || "");
    const subjectAndNumber = cleanText(`${dbCourse.subject} ${dbCourse.courseNumber}`);
    const subjectAndNumberNoSpace = normalizeCourseInput(
      `${dbCourse.subject}${dbCourse.courseNumber}`
    );

    return (
      input === numberOnly ||
      input === subjectOnly ||
      input === subjectAndNumber ||
      inputNoSpace === subjectAndNumberNoSpace ||
      subjectAndNumber.includes(input) ||
      subjectAndNumberNoSpace.includes(inputNoSpace) ||
      numberOnly.includes(input) ||
      subjectOnly.includes(input)
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

  const filteredByTypedCourse = useMemo(() => {
    return (database as DatabaseCourse[]).filter((item) => courseMatches(item, course));
  }, [course]);

  const filteredByTypedProfessor = useMemo(() => {
    return (database as DatabaseCourse[]).filter((item) =>
      professorMatches(item, professor)
    );
  }, [professor]);

  const uniqueProfessorSuggestions = useMemo(() => {
    const typedProfessor = cleanProfessorName(professor);
    const typedCourse = cleanText(course);

    if (typedProfessor === "" && typedCourse === "") return [];

    const source =
      typedCourse !== "" ? filteredByTypedCourse : (database as DatabaseCourse[]);

    const foundNames = new Map<string, string>();

    source.forEach((item) => {
      const fullName = item.professorFullName?.trim();
      const lastName = item.professorLastName?.trim();
      const shortName = item.professor?.trim();

      if (!fullName) return;

      const fullNameClean = cleanProfessorName(fullName);
      const lastNameClean = cleanProfessorName(lastName || "");
      const shortNameClean = cleanProfessorName(shortName || "");

      const matchesProfessorText =
        typedProfessor === "" ||
        fullNameClean.includes(typedProfessor) ||
        lastNameClean.includes(typedProfessor) ||
        shortNameClean.includes(typedProfessor) ||
        typedProfessor === getLastName(fullName);

      if (matchesProfessorText && !foundNames.has(fullName)) {
        foundNames.set(fullName, fullName);
      }
    });

    return Array.from(foundNames.values()).sort((a, b) => {
      const aFull = cleanProfessorName(a);
      const bFull = cleanProfessorName(b);
      const aLast = getLastName(a);
      const bLast = getLastName(b);

      const aStarts =
        typedProfessor !== "" &&
        (aFull.startsWith(typedProfessor) || aLast.startsWith(typedProfessor))
          ? 0
          : 1;

      const bStarts =
        typedProfessor !== "" &&
        (bFull.startsWith(typedProfessor) || bLast.startsWith(typedProfessor))
          ? 0
          : 1;

      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.localeCompare(b);
    });
  }, [professor, course, filteredByTypedCourse]);

  const uniqueCourseSuggestions = useMemo(() => {
    const typedCourse = cleanText(course);
    const typedProfessor = cleanProfessorName(professor);

    if (typedCourse === "" && typedProfessor === "") return [];

    const source =
      typedProfessor !== "" ? filteredByTypedProfessor : (database as DatabaseCourse[]);

    const foundCourses = new Map<string, CourseSuggestion>();

    source.forEach((item) => {
      const label = courseDisplay(item.subject, item.courseNumber);
      const key = `${item.subject}-${item.courseNumber}`;

      const numberOnly = cleanText(item.courseNumber || "");
      const subjectOnly = cleanText(item.subject || "");
      const subjectAndNumber = cleanText(`${item.subject} ${item.courseNumber}`);
      const subjectAndNumberNoSpace = normalizeCourseInput(
        `${item.subject}${item.courseNumber}`
      );
      const typedNoSpace = normalizeCourseInput(course);

      const matchesCourseText =
        typedCourse === "" ||
        numberOnly.includes(typedCourse) ||
        subjectOnly.includes(typedCourse) ||
        subjectAndNumber.includes(typedCourse) ||
        subjectAndNumberNoSpace.includes(typedNoSpace);

      if (matchesCourseText && !foundCourses.has(key)) {
        foundCourses.set(key, {
          label,
          subject: item.subject,
          courseNumber: item.courseNumber,
        });
      }
    });

    return Array.from(foundCourses.values()).sort((a, b) => {
      const aLabel = cleanText(a.label);
      const bLabel = cleanText(b.label);
      const typedNoSpace = normalizeCourseInput(course);
      const aNoSpace = normalizeCourseInput(a.label);
      const bNoSpace = normalizeCourseInput(b.label);

      const aStarts =
        typedCourse !== "" &&
        (aLabel.startsWith(typedCourse) || aNoSpace.startsWith(typedNoSpace))
          ? 0
          : 1;

      const bStarts =
        typedCourse !== "" &&
        (bLabel.startsWith(typedCourse) || bNoSpace.startsWith(typedNoSpace))
          ? 0
          : 1;

      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.label.localeCompare(b.label);
    });
  }, [professor, course, filteredByTypedProfessor]);

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
      Alert.alert(
        "Missing Info",
        "Please enter both professor and course. You can type either one first."
      );
      return;
    }

    const foundCourses = (database as DatabaseCourse[]).filter((item) => {
      return professorMatches(item, professor) && courseMatches(item, course);
    });

    if (foundCourses.length === 0) {
      Alert.alert(
        "Course Not Found",
        "We could not find that class. Try a professor last name or full name, and use something like 1100 or CSET 1100."
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

  const resetMyLocalData = () => {
    Alert.alert(
      "Reset My Data",
      "This clears only this device's saved courses and selected professor.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              await AsyncStorage.removeItem(LAST_SELECTED_PROFESSOR_KEY);
              setSavedCourses([]);
              setMatchingSections([]);
              setProfessor("");
              setCourse("");
            } catch (error) {
              console.log("Could not reset local data:", error);
            }
          },
        },
      ]
    );
  };

  const chooseProfessorFromDropdown = (name: string) => {
    setProfessor(name);
    setMatchingSections([]);
  };

  const chooseCourseFromDropdown = (chosenCourse: CourseSuggestion) => {
    setCourse(chosenCourse.label);
    setMatchingSections([]);
  };

  const exactProfessorChosen =
    professor.trim() !== "" &&
    uniqueProfessorSuggestions.some(
      (name) => cleanProfessorName(name) === cleanProfessorName(professor)
    );

  const exactCourseChosen =
    course.trim() !== "" &&
    uniqueCourseSuggestions.some(
      (item) =>
        cleanText(item.label) === cleanText(course) ||
        normalizeCourseInput(item.label) === normalizeCourseInput(course)
    );

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
            <Text style={styles.helperText}>
              You can type professor first or course first.
            </Text>

            <Pressable style={styles.resetButton} onPress={resetMyLocalData}>
              <Text style={styles.resetButtonText}>Reset My Local Data</Text>
            </Pressable>

            <Text style={styles.label}>Professor Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter professor last name or full name"
              placeholderTextColor="#7f90aa"
              value={professor}
              onChangeText={setProfessor}
            />

            {uniqueProfessorSuggestions.length > 0 &&
              (professor.trim() !== "" || course.trim() !== "") &&
              !exactProfessorChosen && (
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
              placeholder="Enter 1100 or CSET 1100"
              placeholderTextColor="#7f90aa"
              value={course}
              onChangeText={setCourse}
            />

            {uniqueCourseSuggestions.length > 0 &&
              (course.trim() !== "" || professor.trim() !== "") &&
              !exactCourseChosen && (
                <View style={styles.searchResultsCard}>
                  {uniqueCourseSuggestions.slice(0, 8).map((item) => (
                    <Pressable
                      key={`${item.subject}-${item.courseNumber}`}
                      style={styles.searchResultButton}
                      onPress={() => chooseCourseFromDropdown(item)}
                    >
                      <Text style={styles.searchResultText}>{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

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

                    <Text style={styles.matchText}>Building: {item.building}</Text>
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
              savedCourses.map((item) => {
                const colorSet = getCourseDayColorSet(item.days);

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.courseCard,
                      {
                        backgroundColor: colorSet.backgroundColor,
                        borderColor: colorSet.borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.courseTitle,
                        { color: colorSet.titleColor },
                      ]}
                    >
                      {item.subject} {item.courseNumber}
                    </Text>

                    <Text style={[styles.courseText, { color: colorSet.textColor }]}>
                      Section: {item.section}
                    </Text>

                    <Text style={[styles.courseText, { color: colorSet.textColor }]}>
                      Professor: {item.professorFullName}
                    </Text>

                    <Text style={[styles.courseText, { color: colorSet.textColor }]}>
                      Building: {item.building}
                    </Text>

                    <Text style={[styles.courseText, { color: colorSet.textColor }]}>
                      Room: {item.room}
                    </Text>

                    <Text style={[styles.courseText, { color: colorSet.textColor }]}>
                      Days: {formatDays(item.days)}
                    </Text>

                    <Text style={[styles.courseText, { color: colorSet.textColor }]}>
                      Time: {formatTime(item.beginTime)} - {formatTime(item.endTime)}
                    </Text>

                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => deleteCourse(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                );
              })
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

  helperText: {
    fontSize: 14,
    color: "#516b91",
    marginBottom: 10,
  },

  resetButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff1f1",
    borderWidth: 1.5,
    borderColor: "#e0a1a1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },

  resetButtonText: {
    color: "#8b3a3a",
    fontWeight: "700",
    fontSize: 13,
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
    borderWidth: 2,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  courseText: {
    fontSize: 14,
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