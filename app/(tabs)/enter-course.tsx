import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import database from "@/data/database.json";
import {
  appThemes,
  defaultSettings,
  loadUserSettings,
  UserSettings,
} from "@/utils/appSettings";
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
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const theme = settings.darkMode ? appThemes.dark : appThemes.light;

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

  const loadSettings = useCallback(async () => {
    const userSettings = await loadUserSettings();
    setSettings(userSettings);
  }, []);

  useEffect(() => {
    loadSavedCourses();
    loadSettings();
  }, [loadSavedCourses, loadSettings]);

  useFocusEffect(
    useCallback(() => {
      loadSavedCourses();
      loadSettings();
    }, [loadSavedCourses, loadSettings])
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <View style={[styles.background, { backgroundColor: theme.screenBg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs settings={settings} />

          <View
            style={[
              styles.headerCard,
              {
                backgroundColor: theme.headerBg,
                borderColor: theme.headerBorder,
              },
            ]}
          >
            <Text style={[styles.headerTitle, { color: theme.headerTitle }]}>
              Enter Courses
            </Text>
            <Text style={[styles.headerText, { color: theme.headerText }]}>
              Add your class info so the map can load what matters to you.
            </Text>
          </View>

          <View
            style={[
              styles.mainCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.helperText, { color: theme.text }]}>
              You can type professor first or course first.
            </Text>

            <Pressable
              style={[
                styles.resetButton,
                {
                  backgroundColor: theme.dangerBg,
                  borderColor: theme.dangerBorder,
                },
              ]}
              onPress={resetMyLocalData}
            >
              <Text style={[styles.resetButtonText, { color: theme.dangerText }]}>
                Reset My Local Data
              </Text>
            </Pressable>

            <Text style={[styles.label, { color: theme.title }]}>
              Professor Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.inputText,
                },
              ]}
              placeholder="Enter professor last name or full name"
              placeholderTextColor={theme.subtext}
              value={professor}
              onChangeText={setProfessor}
            />

            {uniqueProfessorSuggestions.length > 0 &&
              (professor.trim() !== "" || course.trim() !== "") &&
              !exactProfessorChosen && (
                <View
                  style={[
                    styles.searchResultsCard,
                    {
                      backgroundColor: theme.bubbleBg,
                      borderColor: theme.bubbleBorder,
                    },
                  ]}
                >
                  {uniqueProfessorSuggestions.slice(0, 8).map((name) => (
                    <Pressable
                      key={name}
                      style={[
                        styles.searchResultButton,
                        { borderBottomColor: theme.cardBorder },
                      ]}
                      onPress={() => chooseProfessorFromDropdown(name)}
                    >
                      <Text style={[styles.searchResultText, { color: theme.title }]}>
                        {name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

            <Text style={[styles.label, { color: theme.title }]}>
              Course Number
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.inputText,
                },
              ]}
              placeholder="Enter 1100 or CSET 1100"
              placeholderTextColor={theme.subtext}
              value={course}
              onChangeText={setCourse}
            />

            {uniqueCourseSuggestions.length > 0 &&
              (course.trim() !== "" || professor.trim() !== "") &&
              !exactCourseChosen && (
                <View
                  style={[
                    styles.searchResultsCard,
                    {
                      backgroundColor: theme.bubbleBg,
                      borderColor: theme.bubbleBorder,
                    },
                  ]}
                >
                  {uniqueCourseSuggestions.slice(0, 8).map((item) => (
                    <Pressable
                      key={`${item.subject}-${item.courseNumber}`}
                      style={[
                        styles.searchResultButton,
                        { borderBottomColor: theme.cardBorder },
                      ]}
                      onPress={() => chooseCourseFromDropdown(item)}
                    >
                      <Text style={[styles.searchResultText, { color: theme.title }]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

            <Pressable
              style={[
                styles.addButton,
                {
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                },
              ]}
              onPress={addCourse}
            >
              <Text style={[styles.addButtonText, { color: theme.buttonText }]}>
                Add Course
              </Text>
            </Pressable>

            {matchingSections.length > 1 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.title }]}>
                  Choose a Section
                </Text>

                {matchingSections.map((item) => (
                  <Pressable
                    key={`${item.subject}-${item.courseNumber}-${item.section}-${item.beginTime}`}
                    style={[
                      styles.matchCard,
                      {
                        backgroundColor: theme.bubbleBg,
                        borderColor: theme.bubbleBorder,
                      },
                    ]}
                    onPress={() => saveChosenCourse(item)}
                  >
                    <Text style={[styles.matchTitle, { color: theme.title }]}>
                      {item.subject} {item.courseNumber} - Section {item.section}
                    </Text>

                    <Text style={[styles.matchText, { color: theme.text }]}>
                      Professor: {item.professorFullName}
                    </Text>

                    <Text style={[styles.matchText, { color: theme.text }]}>
                      Building: {item.building}
                    </Text>

                    <Text style={[styles.matchText, { color: theme.text }]}>
                      Room: {item.room}
                    </Text>

                    <Text style={[styles.matchText, { color: theme.text }]}>
                      Days: {formatDays(item.days)}
                    </Text>

                    <Text style={[styles.matchText, { color: theme.text }]}>
                      Time: {formatTime(item.beginTime)} - {formatTime(item.endTime)}
                    </Text>

                    <Text style={[styles.tapText, { color: theme.buttonText }]}>
                      Tap to save this section
                    </Text>
                  </Pressable>
                ))}
              </>
            )}

            <Text style={[styles.sectionTitle, { color: theme.title }]}>
              Saved Courses
            </Text>

            {savedCourses.length === 0 ? (
              <View
                style={[
                  styles.courseCard,
                  {
                    backgroundColor: theme.bubbleBg,
                    borderColor: theme.bubbleBorder,
                  },
                ]}
              >
                <Text style={[styles.courseText, { color: theme.subtext }]}>
                  No saved courses yet.
                </Text>
              </View>
            ) : (
              savedCourses.map((item) => {
                const colorSet = getCourseDayColorSet(
                  item.days,
                  settings.showCourseColors,
                  settings.darkMode
                );

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
                      style={[
                        styles.deleteButton,
                        {
                          backgroundColor: theme.dangerBg,
                          borderColor: theme.dangerBorder,
                        },
                      ]}
                      onPress={() => deleteCourse(item.id)}
                    >
                      <Text
                        style={[styles.deleteButtonText, { color: theme.dangerText }]}
                      >
                        Delete
                      </Text>
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
  },

  background: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 120,
  },

  headerCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  headerText: {
    fontSize: 15,
    lineHeight: 22,
  },

  mainCard: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 18,
  },

  helperText: {
    fontSize: 14,
    marginBottom: 10,
  },

  resetButton: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },

  resetButtonText: {
    fontWeight: "700",
    fontSize: 13,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },

  searchResultsCard: {
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
  },

  searchResultButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },

  searchResultText: {
    fontSize: 15,
    fontWeight: "600",
  },

  addButton: {
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 8,
  },

  matchCard: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },

  matchTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },

  matchText: {
    fontSize: 14,
    marginBottom: 2,
  },

  tapText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
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
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  deleteButtonText: {
    fontWeight: "700",
    fontSize: 13,
  },
});