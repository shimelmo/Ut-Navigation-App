// Floating AI helper button shown in bottom corner on this screen
import AIBubble from "@/components/AIBubble";
// Custom navigation tabs displayed at top of page
import TopTabs from "@/components/TopTabs";
// Local JSON file containing class/course data used for example room loading
import database from "@/data/database.json";
// Floor map room definitions and styling info for every room on floor 1
import { getRoomStyles, MAP_H, MAP_W, ROOMS } from "@/data/floorMapData";
import {
  appThemes,
  defaultSettings,
  loadUserSettings,
  UserSettings,
} from "@/utils/appSettings";
import { findRoute } from "@/utils/pathfinding";
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
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";

// Shape of one course record pulled from database.json
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

// Fixed starting room: route always begins from this entrance room
const START_ROOM_ID = "C1002";
const ROOM_INSET = 18;
const ROUTE_STROKE_WIDTH = 6;

// Main map screen component: handles room search, route generation, and map drawing
export default function MapScreen() {
  // Text typed by user into room search box
  const [roomSearch, setRoomSearch] = useState("");
  // Currently selected destination room on map
  const [selectedRoomId, setSelectedRoomId] = useState<string>("1200");
  // User settings like dark mode
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Runs once when screen loads: load saved settings into screen
  useEffect(() => {
    const loadSettingsIntoScreen = async () => {
      const userSettings = await loadUserSettings();
      setSettings(userSettings);
    };

    loadSettingsIntoScreen();
  }, []);

  const theme = settings.darkMode ? appThemes.dark : appThemes.light;
  const roomStyles = getRoomStyles(settings.darkMode);

  // Find full room object for currently selected destination room
  const selectedRoom = useMemo(() => {
    return ROOMS.find((room) => room.id === selectedRoomId) || null;
  }, [selectedRoomId]);

  // Find full room object for starting room
  const startRoom = useMemo(() => {
    return ROOMS.find((room) => room.id === START_ROOM_ID) || null;
  }, []);

  // Calculate route path points from start room to destination room
  const routePoints = useMemo(() => {
    return findRoute(START_ROOM_ID, selectedRoomId, 1);
  }, [selectedRoomId]);

  // Search for typed room number/name and select it if found
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

  // Demo button: loads BIOE 1010 room from database and selects that room on map
  const loadExampleCourseRoom = () => {
    const match = (database as DatabaseCourse[]).find(
      (course) => course.subject === "BIOE" && course.courseNumber === "1010"
    );

    if (!match) return;

    const roomId = match.room.replace("NE ", "").trim().toUpperCase();
    const foundRoom = ROOMS.find((room) => room.id.toUpperCase() === roomId);

    if (foundRoom) {
      setSelectedRoomId(foundRoom.id);
    }
  };

  // Reset destination back to default room and clear search box
  const resetSelection = () => {
    setSelectedRoomId("1200");
    setRoomSearch("");
  };

  // Begin rendering visible screen UI below
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
              1st Floor Building Map
            </Text>
            <Text style={[styles.headerText, { color: theme.headerText }]}>
              Search a room, load an example course room, and view the route from
              the main entrance.
            </Text>
          </View>

          <View
            style={[
              styles.controlsCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                },
              ]}
              placeholder="Search room like 1200 or Large Classroom"
              placeholderTextColor={settings.darkMode ? "#94a3b8" : "#7f90aa"}
              value={roomSearch}
              onChangeText={setRoomSearch}
            />

            <View style={styles.buttonRow}>
              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.buttonBorder,
                  },
                ]}
                onPress={searchRoom}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: theme.buttonText },
                  ]}
                >
                  Search Room
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.buttonBorder,
                  },
                ]}
                onPress={loadExampleCourseRoom}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: theme.buttonText },
                  ]}
                >
                  Load Example Course
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.buttonBorder,
                  },
                ]}
                onPress={resetSelection}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: theme.buttonText },
                  ]}
                >
                  Reset
                </Text>
              </Pressable>
            </View>

            <View style={styles.infoWrap}>
              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: theme.infoBg,
                    borderColor: theme.infoBorder,
                  },
                ]}
              >
                <Text style={[styles.infoTitle, { color: theme.infoTitle }]}>
                  Current Location
                </Text>
                <Text style={[styles.infoText, { color: theme.infoText }]}>
                  {startRoom
                    ? `${startRoom.id} — ${startRoom.name}`
                    : "Not chosen yet"}
                </Text>
              </View>

              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: theme.infoBg,
                    borderColor: theme.infoBorder,
                  },
                ]}
              >
                <Text style={[styles.infoTitle, { color: theme.infoTitle }]}>
                  Destination
                </Text>
                <Text style={[styles.infoText, { color: theme.infoText }]}>
                  {selectedRoom
                    ? `${selectedRoom.id} — ${selectedRoom.name}`
                    : "Not chosen yet"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.mapCard,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <ScrollView showsVerticalScrollIndicator>
                <Svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
                  <Rect
                    x={0}
                    y={0}
                    width={MAP_W}
                    height={MAP_H}
                    fill={settings.darkMode ? "#0f172a" : "#f4efe6"}
                  />

                  {/* Draw blue route line segment-by-segment between each route point */}
                  {routePoints &&
                    routePoints.slice(0, -1).map((point, index) => {
                      const nextPoint = routePoints[index + 1];
  // Begin rendering visible screen UI below
                      return (
                        <Line
                          key={`line-${index}`}
                          x1={point.x}
                          y1={point.y}
                          x2={nextPoint.x}
                          y2={nextPoint.y}
                          stroke={settings.darkMode ? "#60a5fa" : "#1e64d0"}
                          strokeWidth={ROUTE_STROKE_WIDTH}
                          strokeLinecap="round"
                        />
                      );
                    })}

                  {/* Draw every room rectangle on the map */}
                  {ROOMS.map((room) => {
                    // Get color/style based on room type (lab, classroom, office, etc.)
                    const roomStyle = roomStyles[room.type];
                    // True if this room is the chosen destination
                    const isSelected = room.id === selectedRoomId;
                    // True if this room is the fixed starting entrance room
                    const isStart = room.id === START_ROOM_ID;

                    // Shrink room rectangle inward slightly so borders look cleaner
                    const inset = Math.min(
                      ROOM_INSET,
                      Math.max(2, room.w * 0.08),
                      Math.max(2, room.h * 0.08)
                    );

                    const drawX = room.x + inset / 2;
                    const drawY = room.y + inset / 2;
                    const drawW = Math.max(8, room.w - inset);
                    const drawH = Math.max(8, room.h - inset);

  // Begin rendering visible screen UI below
                    return (
                      <React.Fragment key={room.id}>
                        <Rect
                          x={drawX}
                          y={drawY}
                          width={drawW}
                          height={drawH}
                          fill={
                            isSelected
                              ? "#ffe59c"
                              : isStart
                              ? "#cdeccf"
                              : roomStyle.fill
                          }
                          stroke={
                            isSelected
                              ? "#ff9f1a"
                              : isStart
                              ? "#2f8f46"
                              : roomStyle.edge
                          }
                          strokeWidth={isSelected || isStart ? 4 : 2}
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

                        {isStart && (
                          <>
                            <Circle
                              cx={room.x + room.w / 2}
                              cy={room.y + room.h / 2}
                              r={28}
                              fill="#2f8f46"
                              opacity={0.18}
                            />
                            <Circle
                              cx={room.x + room.w / 2}
                              cy={room.y + room.h / 2}
                              r={12}
                              fill="#2f8f46"
                              opacity={0.95}
                            />
                          </>
                        )}

                        {isSelected && (
                          <>
                            <Circle
                              cx={room.x + room.w / 2}
                              cy={room.y + room.h / 2}
                              r={28}
                              fill="#ff5c5c"
                              opacity={0.18}
                            />
                            <Circle
                              cx={room.x + room.w / 2}
                              cy={room.y + room.h / 2}
                              r={12}
                              fill="#ff5c5c"
                              opacity={0.95}
                            />
                          </>
                        )}
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

// Style definitions: controls layout, spacing, borders, text sizes, etc.
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

  controlsCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  input: {
    borderWidth: 2,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  actionButton: {
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  actionButtonText: {
    fontSize: 15,
    fontWeight: "800",
  },

  infoWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  infoCard: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    minWidth: 220,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 14,
  },

  mapCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 10,
  },
});