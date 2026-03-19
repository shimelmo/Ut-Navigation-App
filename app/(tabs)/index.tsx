import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import { MAP_H, MAP_W, ROOMS, TYPES } from "@/data/floorMapData";
import { getCourseDayColorSet } from "@/utils/courseColors";
import { findRoute } from "@/utils/pathfinding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";

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

export default function HomeScreen() {
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [currentLocationRoomId, setCurrentLocationRoomId] = useState<string | null>(null);
  const [chooseLocationMode, setChooseLocationMode] = useState(false);
  const [zoom, setZoom] = useState(0.58);
  const [selectedFloor, setSelectedFloor] = useState<1 | 2>(1);

  useEffect(() => {
    loadSavedCourses();
  }, []);

  const loadSavedCourses = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedCourses(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Could not load saved courses:", error);
    }
  };

  const sortedCourses = useMemo(() => {
    return [...savedCourses].sort((a, b) => {
      const aTime = Number(a.beginTime || "9999");
      const bTime = Number(b.beginTime || "9999");
      return aTime - bTime;
    });
  }, [savedCourses]);

  const selectedRoom = useMemo(() => {
    if (!selectedRoomId) return null;
    return ROOMS.find((room) => room.id === selectedRoomId) || null;
  }, [selectedRoomId]);

  const currentLocationRoom = useMemo(() => {
    if (!currentLocationRoomId) return null;
    return ROOMS.find((room) => room.id === currentLocationRoomId) || null;
  }, [currentLocationRoomId]);

  const routePoints = useMemo(() => {
    if (!selectedRoomId || !currentLocationRoomId) return null;
    return findRoute(currentLocationRoomId, selectedRoomId);
  }, [currentLocationRoomId, selectedRoomId]);

  const formatTime = (time: string) => {
    if (!time || time.length < 3) return time;

    const clean = time.padStart(4, "0");
    const hour = parseInt(clean.slice(0, 2), 10);
    const minute = clean.slice(2);
    const amOrPm = hour >= 12 ? "PM" : "AM";
    const convertedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${convertedHour}:${minute} ${amOrPm}`;
  };

  const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return "No days listed";
    return days.join(", ");
  };

  const roomIdFromSavedCourse = (room: string) => {
    return room.replace("NE ", "").trim().toUpperCase();
  };

  const handleRoomPress = (roomId: string) => {
    if (selectedFloor !== 1) return;

    if (!currentLocationRoomId || chooseLocationMode) {
      setCurrentLocationRoomId(roomId);
      setChooseLocationMode(false);
      return;
    }

    setSelectedRoomId(roomId);
  };

  const handleSavedCoursePress = (course: SavedCourse) => {
    const roomId = roomIdFromSavedCourse(course.room);
    const foundRoom = ROOMS.find((room) => room.id.toUpperCase() === roomId);

    if (!foundRoom) return;

    setSelectedFloor(1);

    if (selectedRoomId === foundRoom.id) {
      setSelectedRoomId(null);
      return;
    }

    setSelectedRoomId(foundRoom.id);
  };

  const clearRoute = () => {
    setSelectedRoomId(null);
    setChooseLocationMode(false);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.12, 1.6));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.12, 0.35));
  };

  const resetView = () => {
    setZoom(0.58);
  };

  const mapWidth = MAP_W * zoom;
  const mapHeight = MAP_H * zoom;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs />

          <View style={styles.titleCard}>
            <Text style={styles.title}>UT Campus Compass</Text>
            <Text style={styles.subtitle}>
              Pick your location, then choose a destination room or saved course.
            </Text>
          </View>

          <View style={styles.mainGrid}>
            <View style={styles.mapSection}>
              <View style={styles.mainCard}>
                <View style={styles.mapHeaderRow}>
                  <Text style={styles.cardTitle}>Map Display</Text>
                  <Text style={styles.cardText}>
                    Tap “Set My Location,” then tap a room. After that, tap any
                    destination room or a saved course.
                  </Text>
                </View>

                <View style={styles.topControlsRow}>
                  <View style={styles.floorToggleWrap}>
                    <Pressable
                      style={[
                        styles.floorButton,
                        selectedFloor === 1 && styles.floorButtonActive,
                      ]}
                      onPress={() => setSelectedFloor(1)}
                    >
                      <Text
                        style={[
                          styles.floorButtonText,
                          selectedFloor === 1 && styles.floorButtonTextActive,
                        ]}
                      >
                        1st Floor
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.floorButton,
                        selectedFloor === 2 && styles.floorButtonActive,
                      ]}
                      onPress={() => setSelectedFloor(2)}
                    >
                      <Text
                        style={[
                          styles.floorButtonText,
                          selectedFloor === 2 && styles.floorButtonTextActive,
                        ]}
                      >
                        2nd Floor
                      </Text>
                    </Pressable>
                  </View>

                  <View style={styles.zoomControls}>
                    <Pressable style={styles.smallButton} onPress={zoomOut}>
                      <Text style={styles.smallButtonText}>−</Text>
                    </Pressable>

                    <Pressable style={styles.smallButton} onPress={resetView}>
                      <Text style={styles.smallButtonText}>Reset View</Text>
                    </Pressable>

                    <Pressable style={styles.smallButton} onPress={zoomIn}>
                      <Text style={styles.smallButtonText}>＋</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      chooseLocationMode && styles.actionButtonActive,
                    ]}
                    onPress={() => setChooseLocationMode(!chooseLocationMode)}
                  >
                    <Text style={styles.actionButtonText}>
                      {chooseLocationMode
                        ? "Tap a room to set location"
                        : currentLocationRoomId
                        ? "Change My Location"
                        : "Set My Location"}
                    </Text>
                  </Pressable>

                  <Pressable style={styles.actionButton} onPress={clearRoute}>
                    <Text style={styles.actionButtonText}>Clear Route</Text>
                  </Pressable>
                </View>

                <View style={styles.infoWrap}>
                  <View style={styles.infoBubble}>
                    <Text style={styles.infoLabel}>Current Location</Text>
                    <Text style={styles.infoValue}>
                      {currentLocationRoom
                        ? `${currentLocationRoom.id} — ${currentLocationRoom.name}`
                        : "Not chosen yet"}
                    </Text>
                  </View>

                  <View style={styles.infoBubble}>
                    <Text style={styles.infoLabel}>Destination</Text>
                    <Text style={styles.infoValue}>
                      {selectedRoom
                        ? `${selectedRoom.id} — ${selectedRoom.name}`
                        : "Not chosen yet"}
                    </Text>
                  </View>
                </View>

                <View style={styles.mapBox}>
                  {selectedFloor === 1 ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator
                      contentContainerStyle={styles.mapScrollContent}
                    >
                      <ScrollView showsVerticalScrollIndicator>
                        <Svg
                          width={mapWidth}
                          height={mapHeight}
                          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                        >
                          <Rect
                            x={0}
                            y={0}
                            width={MAP_W}
                            height={MAP_H}
                            fill="#f4efe6"
                          />

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
                            const isStart = room.id === currentLocationRoomId;

                            return (
                              <React.Fragment key={room.id}>
                                <Rect
                                  x={room.x}
                                  y={room.y}
                                  width={room.w}
                                  height={room.h}
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
                                  onPress={() => handleRoomPress(room.id)}
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
                                  <Circle
                                    cx={room.x + room.w / 2}
                                    cy={room.y + room.h / 2}
                                    r={18}
                                    fill="#2f8f46"
                                    opacity={0.85}
                                  />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </Svg>
                      </ScrollView>
                    </ScrollView>
                  ) : (
                    <View style={styles.floorPlaceholder}>
                      <Text style={styles.floorPlaceholderTitle}>
                        2nd Floor Coming Next
                      </Text>
                      <Text style={styles.floorPlaceholderText}>
                        Later, this floor toggle can load second-floor room data
                        and highlight that room automatically.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.sideSection}>
              <View style={styles.sideCard}>
                <Text style={styles.sideTitle}>Saved Courses</Text>
                <Text style={styles.sideSubtitle}>
                  Sorted by start time. Tap a course to highlight its room. Tap
                  it again to deselect it.
                </Text>

                {sortedCourses.length === 0 ? (
                  <View style={styles.courseCard}>
                    <Text style={styles.courseText}>No saved courses yet.</Text>
                  </View>
                ) : (
                  sortedCourses.map((course) => {
                    const courseRoomId = roomIdFromSavedCourse(course.room);
                    const isActive = selectedRoomId === courseRoomId;
                    const colorSet = getCourseDayColorSet(course.days);

                    return (
                      <Pressable
                        key={course.id}
                        onPress={() => handleSavedCoursePress(course)}
                        style={({ hovered, pressed }) => [
                          styles.courseCard,
                          {
                            backgroundColor: colorSet.backgroundColor,
                            borderColor: colorSet.borderColor,
                          },
                          isActive && styles.courseCardActive,
                          hovered && styles.courseCardHover,
                          pressed && styles.courseCardPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.courseTitle,
                            { color: colorSet.titleColor },
                          ]}
                        >
                          {course.subject} {course.courseNumber}
                        </Text>

                        <Text
                          style={[
                            styles.courseText,
                            { color: colorSet.textColor },
                          ]}
                        >
                          Section: {course.section}
                        </Text>

                        <Text
                          style={[
                            styles.courseText,
                            { color: colorSet.textColor },
                          ]}
                        >
                          Professor: {course.professorFullName}
                        </Text>

                        <Text
                          style={[
                            styles.courseText,
                            { color: colorSet.textColor },
                          ]}
                        >
                          Room: {course.room}
                        </Text>

                        <Text
                          style={[
                            styles.courseText,
                            { color: colorSet.textColor },
                          ]}
                        >
                          Days: {formatDays(course.days)}
                        </Text>

                        <Text
                          style={[
                            styles.courseText,
                            { color: colorSet.textColor },
                          ]}
                        >
                          Time: {formatTime(course.beginTime)} -{" "}
                          {formatTime(course.endTime)}
                        </Text>
                      </Pressable>
                    );
                  })
                )}
              </View>
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

  mainGrid: {
    gap: 16,
  },

  mapSection: {
    width: "100%",
  },

  sideSection: {
    width: "100%",
  },

  mainCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
  },

  sideCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d8e3f6",
    borderRadius: 28,
    padding: 18,
  },

  mapHeaderRow: {
    marginBottom: 14,
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
  },

  topControlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  floorToggleWrap: {
    flexDirection: "row",
    gap: 8,
  },

  floorButton: {
    backgroundColor: "#eef4ff",
    borderWidth: 2,
    borderColor: "#c2d6f5",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  floorButtonActive: {
    backgroundColor: "#dcecff",
    borderColor: "#234a84",
  },

  floorButtonText: {
    color: "#54709b",
    fontWeight: "800",
    fontSize: 14,
  },

  floorButtonTextActive: {
    color: "#183a6b",
  },

  zoomControls: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  smallButton: {
    backgroundColor: "#dcecff",
    borderWidth: 2,
    borderColor: "#234a84",
    borderRadius: 999,
    minWidth: 52,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  smallButtonText: {
    color: "#183a6b",
    fontWeight: "800",
    fontSize: 14,
  },

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
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

  actionButtonActive: {
    backgroundColor: "#fff6cc",
    borderColor: "#d6ad2f",
  },

  actionButtonText: {
    color: "#183a6b",
    fontSize: 15,
    fontWeight: "800",
  },

  infoWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  infoBubble: {
    backgroundColor: "#fff9eb",
    borderWidth: 2,
    borderColor: "#f1e2b5",
    borderRadius: 18,
    padding: 12,
    minWidth: 220,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#8b6f19",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: 14,
    color: "#6f5b19",
    fontWeight: "700",
  },

  mapBox: {
    height: 560,
    borderRadius: 24,
    backgroundColor: "#fff8e8",
    borderWidth: 2,
    borderColor: "#f0dfb2",
    overflow: "hidden",
    padding: 10,
  },

  mapScrollContent: {
    alignItems: "flex-start",
  },

  floorPlaceholder: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#eef4ff",
    borderWidth: 2,
    borderColor: "#c2d6f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  floorPlaceholderTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 8,
  },

  floorPlaceholderText: {
    fontSize: 15,
    color: "#4f6f9a",
    textAlign: "center",
    lineHeight: 22,
  },

  sideTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#183a6b",
    marginBottom: 6,
  },

  sideSubtitle: {
    fontSize: 14,
    color: "#516b91",
    lineHeight: 20,
    marginBottom: 14,
  },

  courseCard: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },

  courseCardActive: {
    borderColor: "#ff9f1a",
    backgroundColor: "#fff2cc",
  },

  courseCardHover: {
    shadowColor: "#f3c96a",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  courseCardPressed: {
    transform: [{ scale: 0.99 }],
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
});