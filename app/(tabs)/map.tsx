import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import database from "@/data/database.json";
import { MAP_H, MAP_W, ROOMS, TYPES } from "@/data/floorMapData";
import { findRoute } from "@/utils/pathfinding";
import React, { useMemo, useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";

type DatabaseCourse = {
  professor: string;
  professorFullName: string;
  professorLastName: string;
  courseNumber: string;
  subject: string;
  room: string;
  days: string[];
  section: string;
};

const START_ROOM_ID = "C1002";

export default function MapScreen() {
  const [roomSearch, setRoomSearch] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("1200");

  const selectedRoom = useMemo(() => {
    return ROOMS.find((room) => room.id === selectedRoomId) || null;
  }, [selectedRoomId]);

  const routePoints = useMemo(() => {
    return findRoute(START_ROOM_ID, selectedRoomId);
  }, [selectedRoomId]);

  const searchRoom = () => {
    const cleaned = roomSearch.trim().toUpperCase().replace("NE ", "");

    const found = ROOMS.find(
      (room) =>
        room.id.toUpperCase() === cleaned ||
        room.name.toUpperCase().includes(cleaned)
    );

    if (found) {
      setSelectedRoomId(found.id);
    }
  };

  const loadExampleCourseRoom = () => {
    const match = (database as DatabaseCourse[]).find(
      (course) => course.subject === "BIOE" && course.courseNumber === "1010"
    );

    if (!match) return;

    const roomId = match.room.replace("NE ", "").trim();
    const foundRoom = ROOMS.find((room) => room.id === roomId);

    if (foundRoom) {
      setSelectedRoomId(foundRoom.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>1st Floor Building Map</Text>
            <Text style={styles.headerText}>
              Search a room or highlight a room from course data.
            </Text>
          </View>

          <View style={styles.controlsCard}>
            <TextInput
              style={styles.input}
              placeholder="Search room like 1200 or Large Classroom"
              placeholderTextColor="#7f90aa"
              value={roomSearch}
              onChangeText={setRoomSearch}
            />

            <View style={styles.buttonRow}>
              <Pressable style={styles.actionButton} onPress={searchRoom}>
                <Text style={styles.actionButtonText}>Search Room</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={loadExampleCourseRoom}>
                <Text style={styles.actionButtonText}>Load Example Course</Text>
              </Pressable>
            </View>

            {selectedRoom && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>
                  Selected Room: {selectedRoom.id}
                </Text>
                <Text style={styles.infoText}>{selectedRoom.name}</Text>
              </View>
            )}
          </View>

          <View style={styles.mapCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <ScrollView showsVerticalScrollIndicator>
                <Svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
                  <Rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#f4efe6" />

                  {routePoints &&
                    routePoints.slice(0, -1).map((point, index) => {
                      const nextPoint = routePoints[index + 1];
                      return (
                        <Line
                          key={`line-${index}`}
                          x1={point.x}
                          y1={point.y}
                          x2={nextPoint.x}
                          y2={nextPoint.y}
                          stroke="#1e64d0"
                          strokeWidth={8}
                          strokeLinecap="round"
                        />
                      );
                    })}

                  {ROOMS.map((room) => {
                    const roomStyle = TYPES[room.type];
                    const isSelected = room.id === selectedRoomId;

                    return (
                      <React.Fragment key={room.id}>
                        <Rect
                          x={room.x}
                          y={room.y}
                          width={room.w}
                          height={room.h}
                          fill={isSelected ? "#ffe59c" : roomStyle.fill}
                          stroke={isSelected ? "#ff9f1a" : roomStyle.edge}
                          strokeWidth={isSelected ? 4 : 2}
                          rx={4}
                        />

                        <SvgText
                          x={room.x + room.w / 2}
                          y={room.y + room.h / 2}
                          fontSize={room.w < 90 || room.h < 60 ? 14 : 22}
                          fill={roomStyle.tc}
                          textAnchor="middle"
                        >
                          {room.id}
                        </SvgText>
                      </React.Fragment>
                    );
                  })}
                </Svg>
              </ScrollView>
            </ScrollView>
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

  controlsCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
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

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  actionButton: {
    backgroundColor: "#dcecff",
    borderWidth: 2,
    borderColor: "#234a84",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  actionButtonText: {
    color: "#183a6b",
    fontSize: 15,
    fontWeight: "800",
  },

  infoCard: {
    backgroundColor: "#fff9eb",
    borderWidth: 2,
    borderColor: "#f1e2b5",
    borderRadius: 18,
    padding: 14,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#5d4c16",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 14,
    color: "#735f22",
  },

  mapCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 24,
    padding: 10,
  },
});