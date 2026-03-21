import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import officeHoursData from "@/data/officeHours.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type OfficeHoursMap = {
  [day: string]: string;
};

type ProfessorOfficeHours = {
  firstName: string;
  lastName: string;
  fullName: string;
  building: string;
  room: string;
  officeHours: OfficeHoursMap;
  additionalInfo: string;
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

const LAST_SELECTED_PROFESSOR_KEY = "last_selected_professor";
const SAVED_COURSES_KEY = "saved_courses";

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

function buildDisplayName(professor: ProfessorOfficeHours) {
  if (professor.fullName?.trim()) return professor.fullName.trim();

  const combined = `${professor.firstName || ""} ${professor.lastName || ""}`.trim();
  if (combined) return combined;

  return professor.lastName || "Unknown Professor";
}

function namesMatch(jsonProfessor: ProfessorOfficeHours, otherName: string) {
  const jsonFull = cleanProfessorName(buildDisplayName(jsonProfessor));
  const jsonLast = cleanProfessorName(jsonProfessor.lastName || "");
  const otherClean = cleanProfessorName(otherName);
  const otherLast = getLastName(otherName);

  if (jsonFull === otherClean) return true;
  if (jsonLast !== "" && jsonLast === otherClean) return true;
  if (jsonFull.includes(otherClean)) return true;
  if (otherClean.includes(jsonFull)) return true;
  if (jsonLast !== "" && jsonLast === otherLast) return true;

  return false;
}

export default function OfficeHoursScreen() {
  const professorList = officeHoursData as ProfessorOfficeHours[];

  const [searchText, setSearchText] = useState("");
  const [selectedProfessorFullName, setSelectedProfessorFullName] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [hasLoadedProfessor, setHasLoadedProfessor] = useState(false);
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);

  const loadPageData = useCallback(async () => {
    try {
      const storedCourses = await AsyncStorage.getItem(SAVED_COURSES_KEY);
      if (storedCourses) {
        setSavedCourses(JSON.parse(storedCourses));
      } else {
        setSavedCourses([]);
      }

      const savedProfessor = await AsyncStorage.getItem(LAST_SELECTED_PROFESSOR_KEY);

      if (savedProfessor) {
        const foundProfessor = professorList.find((professor) =>
          namesMatch(professor, savedProfessor)
        );

        if (foundProfessor) {
          setSelectedProfessorFullName(buildDisplayName(foundProfessor));
          const foundDays = Object.keys(foundProfessor.officeHours || {});
          setSelectedDay(foundDays[0] || "");
        } else {
          setSelectedProfessorFullName("");
          setSelectedDay("");
        }
      } else {
        setSelectedProfessorFullName("");
        setSelectedDay("");
      }
    } catch (error) {
      console.log("Could not load office hours page data:", error);
    } finally {
      setHasLoadedProfessor(true);
    }
  }, [professorList]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  useFocusEffect(
    useCallback(() => {
      loadPageData();
    }, [loadPageData])
  );

  const savedProfessorCards = useMemo(() => {
    const matchedProfessors: ProfessorOfficeHours[] = [];
    const seenNames = new Set<string>();

    savedCourses.forEach((course) => {
      const possibleNames = [course.professorFullName, course.professor].filter(Boolean);

      const foundProfessor = professorList.find((professor) =>
        possibleNames.some((name) => namesMatch(professor, name))
      );

      if (foundProfessor) {
        const displayName = buildDisplayName(foundProfessor);
        const cleanName = cleanProfessorName(displayName);

        if (!seenNames.has(cleanName)) {
          seenNames.add(cleanName);
          matchedProfessors.push(foundProfessor);
        }
      }
    });

    return matchedProfessors.sort((a, b) =>
      buildDisplayName(a).localeCompare(buildDisplayName(b))
    );
  }, [savedCourses, professorList]);

  const filteredProfessors = useMemo(() => {
    const typed = cleanProfessorName(searchText);

    if (typed === "") return [];

    return professorList
      .filter((professor) => {
        const displayName = buildDisplayName(professor);
        const fullName = cleanProfessorName(displayName);
        const lastName = getLastName(displayName);

        return (
          fullName.includes(typed) ||
          lastName.includes(typed) ||
          typed.includes(lastName)
        );
      })
      .sort((a, b) => {
        const aDisplay = buildDisplayName(a);
        const bDisplay = buildDisplayName(b);

        const aFull = cleanProfessorName(aDisplay);
        const bFull = cleanProfessorName(bDisplay);
        const aLast = getLastName(aDisplay);
        const bLast = getLastName(bDisplay);

        const aStarts =
          aFull.startsWith(typed) || aLast.startsWith(typed) ? 0 : 1;
        const bStarts =
          bFull.startsWith(typed) || bLast.startsWith(typed) ? 0 : 1;

        if (aStarts !== bStarts) return aStarts - bStarts;

        return aDisplay.localeCompare(bDisplay);
      });
  }, [searchText, professorList]);

  const selectedProfessor = selectedProfessorFullName
    ? professorList.find((professor) =>
        namesMatch(professor, selectedProfessorFullName)
      )
    : undefined;

  const availableDays = selectedProfessor
    ? Object.keys(selectedProfessor.officeHours || {})
    : [];

  const activeDay =
    selectedDay && selectedProfessor?.officeHours[selectedDay]
      ? selectedDay
      : availableDays[0] || "";

  const activeHours =
    selectedProfessor && activeDay
      ? selectedProfessor.officeHours[activeDay]
      : "";

  async function chooseProfessor(fullName: string) {
    setSelectedProfessorFullName(fullName);

    const foundProfessor = professorList.find((professor) =>
      namesMatch(professor, fullName)
    );

    if (foundProfessor) {
      const foundDays = Object.keys(foundProfessor.officeHours || {});
      setSelectedDay(foundDays[0] || "");

      try {
        await AsyncStorage.setItem(
          LAST_SELECTED_PROFESSOR_KEY,
          buildDisplayName(foundProfessor)
        );
      } catch (error) {
        console.log("Could not save selected professor:", error);
      }
    } else {
      setSelectedDay("");
    }

    setSearchText("");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Office Hours</Text>
            <Text style={styles.headerText}>
              View office hours for professors from your confirmed courses, or search manually.
            </Text>
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.sectionTitle}>Your Professors</Text>

            {savedProfessorCards.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No confirmed professors yet. Add courses in Enter Courses first,
                  and your professors will appear here automatically.
                </Text>
              </View>
            ) : (
              <View style={styles.savedProfessorWrap}>
                {savedProfessorCards.map((professor) => {
                  const displayName = buildDisplayName(professor);
                  const isActive =
                    cleanProfessorName(selectedProfessorFullName) ===
                    cleanProfessorName(displayName);

                  return (
                    <Pressable
                      key={displayName}
                      style={[
                        styles.savedProfessorButton,
                        isActive && styles.savedProfessorButtonActive,
                      ]}
                      onPress={() => chooseProfessor(displayName)}
                    >
                      <Text
                        style={[
                          styles.savedProfessorButtonText,
                          isActive && styles.savedProfessorButtonTextActive,
                        ]}
                      >
                        {displayName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <Text style={styles.sectionTitle}>Find a Professor</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Type professor name..."
              placeholderTextColor="#7b90ad"
              value={searchText}
              onChangeText={setSearchText}
            />

            {searchText.trim() !== "" && (
              <View style={styles.searchResultsCard}>
                {filteredProfessors.length > 0 ? (
                  filteredProfessors.slice(0, 8).map((professor) => {
                    const displayName = buildDisplayName(professor);

                    return (
                      <Pressable
                        key={displayName}
                        style={styles.searchResultButton}
                        onPress={() => chooseProfessor(displayName)}
                      >
                        <Text style={styles.searchResultText}>
                          {displayName}
                        </Text>
                      </Pressable>
                    );
                  })
                ) : (
                  <Text style={styles.noResultsText}>No professors found.</Text>
                )}
              </View>
            )}

            {hasLoadedProfessor && selectedProfessor && (
              <>
                <Text style={styles.sectionTitle}>Selected Professor</Text>

                <View style={styles.profCard}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>👩‍🏫</Text>
                  </View>

                  <View style={styles.profInfo}>
                    <Text style={styles.profName}>
                      {buildDisplayName(selectedProfessor)}
                    </Text>
                    <Text style={styles.profDetail}>
                      Building: {selectedProfessor.building}
                    </Text>
                    <Text style={styles.profDetail}>
                      Room: {selectedProfessor.room}
                    </Text>
                  </View>
                </View>

                {availableDays.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Available Days</Text>

                    <View style={styles.dayWrap}>
                      {availableDays.map((day) => {
                        const isActive = activeDay === day;

                        return (
                          <Pressable
                            key={day}
                            style={[
                              styles.dayButton,
                              isActive && styles.activeDayButton,
                            ]}
                            onPress={() => setSelectedDay(day)}
                          >
                            <Text
                              style={[
                                styles.dayText,
                                isActive && styles.activeDayText,
                              ]}
                            >
                              {day}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <View style={styles.hoursCard}>
                      <Text style={styles.hoursTitle}>{activeDay}</Text>
                      <Text style={styles.hoursTime}>{activeHours}</Text>

                      {selectedProfessor.additionalInfo ? (
                        <Text style={styles.hoursExtra}>
                          Additional Info: {selectedProfessor.additionalInfo}
                        </Text>
                      ) : (
                        <Text style={styles.hoursExtra}>
                          Additional Info: None listed
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </>
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
    backgroundColor: "#e7f7ef",
    borderWidth: 2,
    borderColor: "#cbe8d8",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f5b49",
    marginBottom: 6,
  },

  headerText: {
    fontSize: 15,
    color: "#427260",
    lineHeight: 22,
  },

  mainCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 12,
    marginTop: 6,
  },

  emptyCard: {
    backgroundColor: "#f7faff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },

  emptyText: {
    fontSize: 14,
    color: "#5e7698",
    lineHeight: 21,
  },

  savedProfessorWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  savedProfessorButton: {
    backgroundColor: "#eef5ff",
    borderWidth: 2,
    borderColor: "#bfd6ff",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  savedProfessorButtonActive: {
    backgroundColor: "#dcecff",
    borderColor: "#234a84",
  },

  savedProfessorButtonText: {
    color: "#234a84",
    fontWeight: "700",
    fontSize: 14,
  },

  savedProfessorButtonTextActive: {
    fontWeight: "800",
  },

  searchInput: {
    backgroundColor: "#f7faff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#183a6b",
    marginBottom: 12,
  },

  searchResultsCard: {
    backgroundColor: "#f7faff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 18,
    marginBottom: 16,
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

  noResultsText: {
    padding: 14,
    fontSize: 15,
    color: "#6d83a3",
  },

  profCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff9eb",
    borderWidth: 2,
    borderColor: "#f1e2b5",
    borderRadius: 22,
    padding: 14,
    marginBottom: 18,
  },

  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#d8e3f6",
  },

  avatarText: {
    fontSize: 34,
  },

  profInfo: {
    flex: 1,
  },

  profName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 4,
  },

  profDetail: {
    fontSize: 14,
    color: "#567196",
    marginBottom: 2,
  },

  dayWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  dayButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d7e3f7",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  activeDayButton: {
    backgroundColor: "#dcecff",
    borderColor: "#234a84",
  },

  dayText: {
    color: "#234a84",
    fontWeight: "600",
  },

  activeDayText: {
    fontWeight: "800",
  },

  hoursCard: {
    backgroundColor: "#f7faff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 22,
    padding: 18,
  },

  hoursTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 8,
  },

  hoursTime: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34598b",
    marginBottom: 10,
  },

  hoursExtra: {
    fontSize: 14,
    color: "#5e7698",
    lineHeight: 21,
  },
});