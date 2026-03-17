import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.titleCard}>
            <Text style={styles.title}>UT Campus Compass</Text>
            <Text style={styles.subtitle}>
              Find your classes, rooms, and office hours—made simple.
            </Text>
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>Map Display</Text>
            <Text style={styles.cardText}>
              Your building map and starred classrooms will appear here.
            </Text>

            <View style={styles.mapBox}>
              <Image
                source={require("@/assets/images/floor-map.png")}
                style={styles.mapImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.noteBubble}>
              <Text style={styles.noteText}>
                ⭐ Saved classes and your location can show here later
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

  titleCard: {
    backgroundColor: "#dcecff",
    borderWidth: 2,
    borderColor: "#c0d7f7",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#35527b",
    lineHeight: 22,
  },

  mainCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
    color: "#516b91",
    lineHeight: 22,
    marginBottom: 18,
  },

  mapBox: {
    height: 500,
    borderRadius: 24,
    backgroundColor: "#fff8e8",
    borderWidth: 2,
    borderColor: "#f0dfb2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
    padding: 10,
  },

  mapImage: {
    width: "100%",
    height: "100%",
  },

  noteBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff6cc",
    borderWidth: 2,
    borderColor: "#f0df95",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  noteText: {
    color: "#6f5b19",
    fontWeight: "700",
    fontSize: 14,
  },
});