import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import officeHoursData from "@/data/officeHours.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
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
  name: string;
  building: string;
  room: string;
  officeHours: OfficeHoursMap;
  additionalInfo: string;
};

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

function namesMatch(nameA: string, nameB: string) {
  const a = cleanProfessorName(nameA);
  const b = cleanProfessorName(nameB);

  if (a === b) return true;
  if (a.includes(b)) return true;
  if (b.includes(a)) return true;

  const aLast = getLastName(a);
  const bLast = getLastName(b);

  return aLast !== "" && aLast === bLast;
}

export default function OfficeHoursScreen() {
  const professorList = officeHoursData as ProfessorOfficeHours[];

  const [searchText, setSearchText] = useState("");
  const [selectedProfessorName, setSelectedProfessorName] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [hasLoadedProfessor, setHasLoadedProfessor] = useState(false);

  useEffect(() => {
    const loadLastProfessor = async () => {
      try {
        const savedProfessor = await AsyncStorage.getItem(
          LAST_SELECTED_PROFESSOR_KEY
        );

        if (savedProfessor) {
          const foundProfessor = professorList.find((professor) =>
            namesMatch(professor.name, savedProfessor)
          );

          if (foundProfessor) {
            setSelectedProfessorName(foundProfessor.name);
            const foundDays = Object.keys(foundProfessor.officeHours);
            setSelectedDay(foundDays[0] || "");
          }
        }
      } catch (error) {
        console.log("Could not load last professor:", error);
      } finally {
        setHasLoadedProfessor(true);
      }
    };

    loadLastProfessor();
  }, []);

  const filteredProfessors = useMemo(() => {
    const typed = cleanProfessorName(searchText);

    if (typed === "") return [];

    return professorList
      .filter((professor) => {
        const fullName = cleanProfessorName(professor.name);
        const lastName = getLastName(professor.name);

        return (
          fullName.includes(typed) ||
          lastName.includes(typed) ||
          typed.includes(lastName)
        );
      })
      .sort((a, b) => {
        const aFull = cleanProfessorName(a.name);
        const bFull = cleanProfessorName(b.name);
        const aLast = getLastName(a.name);
        const bLast = getLastName(b.name);

        const aStarts =
          aFull.startsWith(typed) || aLast.startsWith(typed) ? 0 : 1;
        const bStarts =
          bFull.startsWith(typed) || bLast.startsWith(typed) ? 0 : 1;

        if (aStarts !== bStarts) return aStarts - bStarts;

        return a.name.localeCompare(b.name);
      });
  }, [searchText, professorList]);

  const selectedProfessor = selectedProfessorName
    ? professorList.find((professor) =>
        namesMatch(professor.name, selectedProfessorName)
      )
    : undefined;

  const availableDays = selectedProfessor
    ? Object.keys(selectedProfessor.officeHours)
    : [];

  const activeDay =
    selectedDay && selectedProfessor?.officeHours[selectedDay]
      ? selectedDay
      : availableDays[0] || "";

  const activeHours =
    selectedProfessor && activeDay
      ? selectedProfessor.officeHours[activeDay]
      : "";

  function chooseProfessor(name: string) {
    setSelectedProfessorName(name);

    const foundProfessor = professorList.find((professor) =>
      namesMatch(professor.name, name)
    );

    if (foundProfessor) {
      const foundDays = Object.keys(foundProfessor.officeHours);
      setSelectedDay(foundDays[0] || "");
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
              Search for a professor to quickly view office hours and office
              location.
            </Text>
          </View>

          <View style={styles.mainCard}>
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
                  filteredProfessors.slice(0, 8).map((professor) => (
                    <Pressable
                      key={professor.name}
                      style={styles.searchResultButton}
                      onPress={() => chooseProfessor(professor.name)}
                    >
                      <Text style={styles.searchResultText}>
                        {professor.name}
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={styles.noResultsText}>No professors found.</Text>
                )}
              </View>
            )}

            {hasLoadedProfessor && selectedProfessor && (
              <>
                <View style={styles.profCard}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>👩‍🏫</Text>
                  </View>

                  <View style={styles.profInfo}>
                    <Text style={styles.profName}>{selectedProfessor.name}</Text>
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