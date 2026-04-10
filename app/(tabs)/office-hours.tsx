// AIBubble = floating AI assistant button shown at bottom of the screen
import AIBubble from "@/components/AIBubble";
// TopTabs = custom top navigation tabs for moving between app pages
import TopTabs from "@/components/TopTabs";
// officeHours.json = local data file containing professor office hours information
import officeHoursData from "@/data/officeHours.json";
import {
  appThemes,
  defaultSettings,
  loadUserSettings,
  UserSettings,
} from "@/utils/appSettings";
// AsyncStorage = local phone storage used to remember saved professor/course info
import AsyncStorage from "@react-native-async-storage/async-storage";
// useFocusEffect = reruns logic when user comes back to this screen
import { useFocusEffect } from "@react-navigation/native";
// React hooks used for state, effects, memoized values, and callbacks
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

// A map object where key = day name and value = office hours string for that day
type OfficeHoursMap = {
  [day: string]: string;
};

// Shape of one professor object from officeHours.json
type ProfessorOfficeHours = {
  firstName: string;
  lastName: string;
  fullName: string;
  building: string;
  room: string;
  officeHours: OfficeHoursMap;
  additionalInfo: string;
};

// Shape of a saved course object from local storage
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

// Storage key for remembering the last professor the user selected
const LAST_SELECTED_PROFESSOR_KEY = "last_selected_professor";
// Storage key for remembering courses the user saved in Enter Courses
const SAVED_COURSES_KEY = "saved_courses";

// Clean professor name text so searching is flexible and ignores punctuation/titles
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

// Pull only the last name from a full professor name
function getLastName(name: string) {
  const cleaned = cleanProfessorName(name);
  const parts = cleaned.split(" ").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : "";
}

// Decide the best name to display for a professor card or search result
function buildDisplayName(professor: ProfessorOfficeHours) {
  if (professor.fullName?.trim()) return professor.fullName.trim();

  const combined = `${professor.firstName || ""} ${professor.lastName || ""}`.trim();
  if (combined) return combined;

  return professor.lastName || "Unknown Professor";
}

// Compare two professor names in a forgiving way so full names and last names still match
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

// Main Office Hours screen component
export default function OfficeHoursScreen() {
  // Convert imported JSON into a typed professor list we can search
  const professorList = officeHoursData as ProfessorOfficeHours[];

  // Text typed by user into the manual professor search box
  const [searchText, setSearchText] = useState("");
  // Name of the professor currently selected on the page
  const [selectedProfessorFullName, setSelectedProfessorFullName] = useState("");
  // Which office-hours day button is currently selected
  const [selectedDay, setSelectedDay] = useState("");
  // Helps prevent the UI from showing professor details before loading finishes
  const [hasLoadedProfessor, setHasLoadedProfessor] = useState(false);
  // Courses loaded from local storage so we can find "your professors" automatically
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  // User settings such as dark mode
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Choose light or dark color theme based on saved settings
  const theme = settings.darkMode ? appThemes.dark : appThemes.light;

  // Load saved courses + remembered professor from device storage when page opens
  const loadPageData = useCallback(async () => {
    try {
      // Get saved courses from local storage
      const storedCourses = await AsyncStorage.getItem(SAVED_COURSES_KEY);
      if (storedCourses) {
        setSavedCourses(JSON.parse(storedCourses));
      } else {
        setSavedCourses([]);
      }

      // Get the last professor the user selected on this page
      const savedProfessor = await AsyncStorage.getItem(LAST_SELECTED_PROFESSOR_KEY);

      if (savedProfessor) {
        // Try to match remembered professor name to one professor in officeHours.json
      // Look for a professor in officeHours.json whose name matches the saved course
    // Find the full professor object that matches the clicked name
        const foundProfessor = professorList.find((professor) =>
          namesMatch(professor, savedProfessor)
        );

        if (foundProfessor) {
          setSelectedProfessorFullName(buildDisplayName(foundProfessor));
          // Grab all available office-hour days for that professor
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
      // Mark loading as finished, even if nothing was found
      setHasLoadedProfessor(true);
    }
  }, [professorList]);

  // Load saved app settings like dark mode
  const loadSettings = useCallback(async () => {
    const userSettings = await loadUserSettings();
    setSettings(userSettings);
  }, []);

  // Run once on first screen load to bring in saved data + settings
  useEffect(() => {
    loadPageData();
    loadSettings();
  }, [loadPageData, loadSettings]);

  // Also refresh page data whenever user returns to this screen
  useFocusEffect(
    useCallback(() => {
      loadPageData();
      loadSettings();
    }, [loadPageData, loadSettings])
  );

  // Build the "Your Professors" buttons from professors found in saved courses
  const savedProfessorCards = useMemo(() => {
    // This array will hold professors that match the user’s saved courses
    const matchedProfessors: ProfessorOfficeHours[] = [];
    // Prevent duplicate professor buttons from being added
    const seenNames = new Set<string>();

    savedCourses.forEach((course) => {
      // Try both full professor name and shorter professor field from saved course
      const possibleNames = [course.professorFullName, course.professor].filter(Boolean);

        // Try to match remembered professor name to one professor in officeHours.json
      // Look for a professor in officeHours.json whose name matches the saved course
    // Find the full professor object that matches the clicked name
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

    // Sort professor buttons alphabetically before showing them
    return matchedProfessors.sort((a, b) =>
      buildDisplayName(a).localeCompare(buildDisplayName(b))
    );
  }, [savedCourses, professorList]);

  // Build search results list based on what user typed in search box
  const filteredProfessors = useMemo(() => {
    // Clean the typed search text so matching is easier
    const typed = cleanProfessorName(searchText);

    // If search box is empty, do not show any dropdown results
    if (typed === "") return [];

    return professorList
      .filter((professor) => {
        const displayName = buildDisplayName(professor);
        const fullName = cleanProfessorName(displayName);
        const lastName = getLastName(displayName);

  // Start rendering everything visible on the screen
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

  // Find the full professor object for the currently selected professor name
  const selectedProfessor = selectedProfessorFullName
    ? professorList.find((professor) =>
        namesMatch(professor, selectedProfessorFullName)
      )
    : undefined;

  // List of day names this professor has office hours for
  const availableDays = selectedProfessor
    ? Object.keys(selectedProfessor.officeHours || {})
    : [];

  // Decide which day should currently be shown in the office hours card
  const activeDay =
    selectedDay && selectedProfessor?.officeHours[selectedDay]
      ? selectedDay
      : availableDays[0] || "";

  // Office hours text for the selected day
  const activeHours =
    selectedProfessor && activeDay
      ? selectedProfessor.officeHours[activeDay]
      : "";

  // Runs when user clicks a professor button or search result
  async function chooseProfessor(fullName: string) {
    // Save selected professor name into state
    setSelectedProfessorFullName(fullName);

        // Try to match remembered professor name to one professor in officeHours.json
      // Look for a professor in officeHours.json whose name matches the saved course
    // Find the full professor object that matches the clicked name
    const foundProfessor = professorList.find((professor) =>
      namesMatch(professor, fullName)
    );

    if (foundProfessor) {
          // Grab all available office-hour days for that professor
      const foundDays = Object.keys(foundProfessor.officeHours || {});
      setSelectedDay(foundDays[0] || "");

      try {
        // Save selected professor to local storage so page remembers it later
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

    // Clear the search box after professor is chosen
    setSearchText("");
  }

  // Start rendering everything visible on the screen
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <View style={[styles.background, { backgroundColor: theme.screenBg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Custom top navigation tabs */}
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
              Office Hours
            </Text>
            <Text style={[styles.headerText, { color: theme.headerText }]}>
              View office hours for professors from your confirmed courses, or search manually.
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
            <Text style={[styles.sectionTitle, { color: theme.title }]}>
              Your Professors
            </Text>

            {/* If user has no saved-course professors, show empty message */}
            {savedProfessorCards.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: theme.bubbleBg,
                    borderColor: theme.bubbleBorder,
                  },
                ]}
              >
                <Text style={[styles.emptyText, { color: theme.subtext }]}>
                  No confirmed professors yet. Add courses in Enter Courses first,
                  and your professors will appear here automatically.
                </Text>
              </View>
            ) : (
              <View style={styles.savedProfessorWrap}>
                {/* Draw one button for each professor found from saved courses */}
                {savedProfessorCards.map((professor) => {
                  const displayName = buildDisplayName(professor);
                  const isActive =
                    cleanProfessorName(selectedProfessorFullName) ===
                    cleanProfessorName(displayName);

  // Start rendering everything visible on the screen
                  return (
                    <Pressable
                      key={displayName}
                      style={[
                        styles.savedProfessorButton,
                        {
                          backgroundColor: theme.inputBg,
                          borderColor: theme.inputBorder,
                        },
                        isActive && {
                          backgroundColor: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                        },
                      ]}
                      onPress={() => chooseProfessor(displayName)}
                    >
                      <Text
                        style={[
                          styles.savedProfessorButtonText,
                          { color: isActive ? theme.buttonText : theme.title },
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

            <Text style={[styles.sectionTitle, { color: theme.title }]}>
              Find a Professor
            </Text>

            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.inputText,
                },
              ]}
              placeholder="Type professor name..."
              placeholderTextColor={theme.subtext}
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* Show live search results only while user is typing */}
            {searchText.trim() !== "" && (
              <View
                style={[
                  styles.searchResultsCard,
                  {
                    backgroundColor: theme.bubbleBg,
                    borderColor: theme.bubbleBorder,
                  },
                ]}
              >
                {/* If matches exist, list clickable professor results */}
                {filteredProfessors.length > 0 ? (
                  filteredProfessors.slice(0, 8).map((professor) => {
                    const displayName = buildDisplayName(professor);

  // Start rendering everything visible on the screen
                    return (
                      <Pressable
                        key={displayName}
                        style={[
                          styles.searchResultButton,
                          { borderBottomColor: theme.cardBorder },
                        ]}
                        onPress={() => chooseProfessor(displayName)}
                      >
                        <Text style={[styles.searchResultText, { color: theme.title }]}>
                          {displayName}
                        </Text>
                      </Pressable>
                    );
                  })
                ) : (
                  <Text style={[styles.noResultsText, { color: theme.subtext }]}>
                    No professors found.
                  </Text>
                )}
              </View>
            )}

            {/* Only show professor details after loading is finished and a professor is selected */}
            {hasLoadedProfessor && selectedProfessor && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.title }]}>
                  Selected Professor
                </Text>

                <View
                  style={[
                    styles.profCard,
                    {
                      backgroundColor: theme.infoBg,
                      borderColor: theme.infoBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.avatarCircle,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                  >
                    <Text style={styles.avatarText}>👩‍🏫</Text>
                  </View>

                  <View style={styles.profInfo}>
                    <Text style={[styles.profName, { color: theme.infoTitle }]}>
                      {buildDisplayName(selectedProfessor)}
                    </Text>
                    <Text style={[styles.profDetail, { color: theme.infoText }]}>
                      Building: {selectedProfessor.building}
                    </Text>
                    <Text style={[styles.profDetail, { color: theme.infoText }]}>
                      Room: {selectedProfessor.room}
                    </Text>
                  </View>
                </View>

                {/* Show day buttons only if this professor actually has office hours listed */}
                {availableDays.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: theme.title }]}>
                      Available Days
                    </Text>

                    <View style={styles.dayWrap}>
                      {/* Draw one button for each available office-hours day */}
                      {availableDays.map((day) => {
                        const isActive = activeDay === day;

  // Start rendering everything visible on the screen
                        return (
                          <Pressable
                            key={day}
                            style={[
                              styles.dayButton,
                              {
                                backgroundColor: theme.inputBg,
                                borderColor: theme.inputBorder,
                              },
                              isActive && {
                                backgroundColor: theme.buttonBg,
                                borderColor: theme.buttonBorder,
                              },
                            ]}
                            onPress={() => setSelectedDay(day)}
                          >
                            <Text
                              style={[
                                styles.dayText,
                                { color: isActive ? theme.buttonText : theme.title },
                                isActive && styles.activeDayText,
                              ]}
                            >
                              {day}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <View
                      style={[
                        styles.hoursCard,
                        {
                          backgroundColor: theme.bubbleBg,
                          borderColor: theme.bubbleBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.hoursTitle, { color: theme.title }]}>
                        {activeDay}
                      </Text>
                      <Text style={[styles.hoursTime, { color: theme.text }]}>
                        {activeHours}
                      </Text>

                      {selectedProfessor.additionalInfo ? (
                        <Text style={[styles.hoursExtra, { color: theme.subtext }]}>
                          Additional Info: {selectedProfessor.additionalInfo}
                        </Text>
                      ) : (
                        <Text style={[styles.hoursExtra, { color: theme.subtext }]}>
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

// Styles for layout, spacing, cards, buttons, and text
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

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 6,
  },

  emptyCard: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
  },

  savedProfessorWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  savedProfessorButton: {
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  savedProfessorButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },

  savedProfessorButtonTextActive: {
    fontWeight: "800",
  },

  searchInput: {
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },

  searchResultsCard: {
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 16,
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

  noResultsText: {
    padding: 14,
    fontSize: 15,
  },

  profCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 22,
    padding: 14,
    marginBottom: 18,
  },

  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 2,
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
    marginBottom: 4,
  },

  profDetail: {
    fontSize: 14,
    marginBottom: 2,
  },

  dayWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  dayButton: {
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  dayText: {
    fontWeight: "600",
  },

  activeDayText: {
    fontWeight: "800",
  },

  hoursCard: {
    borderWidth: 2,
    borderRadius: 22,
    padding: 18,
  },

  hoursTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },

  hoursTime: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  hoursExtra: {
    fontSize: 14,
    lineHeight: 21,
  },
});