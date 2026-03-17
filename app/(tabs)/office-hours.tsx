import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function OfficeHoursScreen() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const officeHoursData: Record<string, string> = {
    Monday: "10:00 AM - 12:00 PM",
    Tuesday: "1:00 PM - 3:00 PM",
    Wednesday: "11:00 AM - 1:00 PM",
    Thursday: "2:00 PM - 4:00 PM",
    Friday: "9:00 AM - 11:00 AM",
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Office Hours</Text>
            <Text style={styles.headerText}>
              Tap a day to view professor availability.
            </Text>
          </View>

          <View style={styles.mainCard}>
            <View style={styles.profCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>👩‍🏫</Text>
              </View>

              <View style={styles.profInfo}>
                <Text style={styles.profName}>Professor Name</Text>
                <Text style={styles.profDetail}>Building: North Engineering</Text>
                <Text style={styles.profDetail}>Location: Room 1200</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Select a Day</Text>

            <View style={styles.dayWrap}>
              {days.map((day) => {
                const isActive = selectedDay === day;

                return (
                  <Pressable
                    key={day}
                    style={[styles.dayButton, isActive && styles.activeDayButton]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[styles.dayText, isActive && styles.activeDayText]}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.hoursCard}>
              <Text style={styles.hoursTitle}>{selectedDay}</Text>
              <Text style={styles.hoursTime}>{officeHoursData[selectedDay]}</Text>
              <Text style={styles.hoursExtra}>
                More professor details can go here later.
              </Text>
            </View>
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

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 12,
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