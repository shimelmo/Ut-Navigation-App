import AIBubble from "@/components/AIBubble";
import TopTabs from "@/components/TopTabs";
import {
  MAP2_H,
  MAP2_W,
  Room2,
  ROOMS_FLOOR_2,
} from "@/data/floor2MapData";
import {
  MAP_H,
  MAP_W,
  Room,
  ROOMS,
  TYPES,
} from "@/data/floorMapData";
import {
  appThemes,
  defaultSettings,
  loadUserSettings,
  UserSettings,
} from "@/utils/appSettings";
import { getCourseDayColorSet } from "@/utils/courseColors";
import { buildRouteSummary, findRoute } from "@/utils/pathfinding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

type FloorNumber = 1 | 2;

type RoomSelection = {
  floor: FloorNumber;
  roomId: string;
};

const STORAGE_KEY = "saved_courses";

export default function HomeScreen() {
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<RoomSelection | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<RoomSelection | null>(null);
  const [chooseLocationMode, setChooseLocationMode] = useState(false);
  const [zoom, setZoom] = useState(0.58);
  const [selectedFloor, setSelectedFloor] = useState<FloorNumber>(1);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const theme = settings.darkMode ? appThemes.dark : appThemes.light;

  const loadSavedCourses = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedCourses(JSON.parse(stored));
      } else {
        setSavedCourses([]);
      }
    } catch (error) {
      console.log("Could not load saved courses:", error);
      setSavedCourses([]);
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

  const sortedCourses = useMemo(() => {
    return [...savedCourses].sort((a, b) => {
      const aTime = Number(a.beginTime || "9999");
      const bTime = Number(b.beginTime || "9999");
      return aTime - bTime;
    });
  }, [savedCourses]);

  const visibleRooms = useMemo(() => {
    return selectedFloor === 1 ? ROOMS : ROOMS_FLOOR_2;
  }, [selectedFloor]);

  const activeMapWidth = selectedFloor === 1 ? MAP_W : MAP2_W;
  const activeMapHeight = selectedFloor === 1 ? MAP_H : MAP2_H;

  const currentLocationRoom = useMemo(() => {
    if (!currentLocation) return null;

    if (currentLocation.floor === 1) {
      return ROOMS.find((room) => room.id === currentLocation.roomId) || null;
    }

    return (
      ROOMS_FLOOR_2.find((room) => room.id === currentLocation.roomId) || null
    );
  }, [currentLocation]);

  const selectedRoom = useMemo(() => {
    if (!selectedDestination) return null;

    if (selectedDestination.floor === 1) {
      return (
        ROOMS.find((room) => room.id === selectedDestination.roomId) || null
      );
    }

    return (
      ROOMS_FLOOR_2.find((room) => room.id === selectedDestination.roomId) ||
      null
    );
  }, [selectedDestination]);

  const routePoints = useMemo(() => {
    if (!currentLocation || !selectedDestination) return null;

    if (currentLocation.floor !== 1 || selectedDestination.floor !== 1) {
      return null;
    }

    return findRoute(currentLocation.roomId, selectedDestination.roomId);
  }, [currentLocation, selectedDestination]);

  const routeSummary = useMemo(() => {
    if (!routePoints || !currentLocationRoom || !selectedRoom) return null;

    return buildRouteSummary(
      routePoints,
      `${currentLocationRoom.id} (${currentLocationRoom.name})`,
      `${selectedRoom.id} (${selectedRoom.name})`
    );
  }, [routePoints, currentLocationRoom, selectedRoom]);

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
    if (chooseLocationMode || !currentLocation) {
      setCurrentLocation({
        floor: selectedFloor,
        roomId,
      });
      setChooseLocationMode(false);
      return;
    }

    setSelectedDestination({
      floor: selectedFloor,
      roomId,
    });
  };

  const handleSavedCoursePress = (course: SavedCourse) => {
    const roomId = roomIdFromSavedCourse(course.room);
    const foundRoom = ROOMS.find(
      (room) => room.id.toUpperCase() === roomId.toUpperCase()
    );

    if (!foundRoom) return;

    setSelectedFloor(1);

    if (
      selectedDestination &&
      selectedDestination.floor === 1 &&
      selectedDestination.roomId === foundRoom.id
    ) {
      setSelectedDestination(null);
      return;
    }

    setSelectedDestination({
      floor: 1,
      roomId: foundRoom.id,
    });
  };

  const clearRoute = () => {
    setSelectedDestination(null);
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

  const mapWidth = activeMapWidth * zoom;
  const mapHeight = activeMapHeight * zoom;

  const renderRoomLabel = (room: Room | Room2) => {
    const textY = room.y + room.h / 2;
    const fontSize =
      room.w < 90 || room.h < 60 ? 14 : room.w < 150 ? 18 : 22;

    return (
      <SvgText
        x={room.x + room.w / 2}
        y={textY}
        fontSize={fontSize}
        fill={TYPES[room.type].tc}
        textAnchor="middle"
      >
        {room.id}
      </SvgText>
    );
  };

  const renderMap = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.mapScrollContent}
      >
        <ScrollView showsVerticalScrollIndicator>
          <Svg
            width={mapWidth}
            height={mapHeight}
            viewBox={`0 0 ${activeMapWidth} ${activeMapHeight}`}
          >
            <Rect
              x={0}
              y={0}
              width={activeMapWidth}
              height={activeMapHeight}
              fill={settings.darkMode ? "#0f172a" : "#f4efe6"}
            />

            {selectedFloor === 1 && routePoints
              ? routePoints.slice(0, -1).map((point, index) => {
                  const nextPoint = routePoints[index + 1];
                  return (
                    <Line
                      key={`line-${index}`}
                      x1={point.x}
                      y1={point.y}
                      x2={nextPoint.x}
                      y2={nextPoint.y}
                      stroke={settings.darkMode ? "#60a5fa" : "#1e64d0"}
                      strokeWidth={8}
                      strokeLinecap="round"
                    />
                  );
                })
              : null}

            {visibleRooms.map((room) => {
              const roomStyle = TYPES[room.type];

              const isSelected =
                selectedDestination?.floor === selectedFloor &&
                selectedDestination.roomId === room.id;

              const isStart =
                currentLocation?.floor === selectedFloor &&
                currentLocation.roomId === room.id;

              return (
                <React.Fragment key={`${selectedFloor}-${room.id}`}>
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

                  {renderRoomLabel(room)}

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
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <View style={[styles.background, { backgroundColor: theme.screenBg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TopTabs settings={settings} />

          <View
            style={[
              styles.titleCard,
              {
                backgroundColor: theme.headerBg,
                borderColor: theme.headerBorder,
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.headerTitle }]}>
              UT Campus Compass
            </Text>
            <Text style={[styles.subtitle, { color: theme.headerText }]}>
              Pick your location, then choose a destination room or saved course.
            </Text>
          </View>

          <View style={styles.mainGrid}>
            <View style={styles.mapSection}>
              <View
                style={[
                  styles.mainCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <View style={styles.mapHeaderRow}>
                  <Text style={[styles.cardTitle, { color: theme.title }]}>
                    Map Display
                  </Text>
                  <Text style={[styles.cardText, { color: theme.text }]}>
                    Tap “Set My Location,” then tap a room. After that, tap any
                    destination room or a saved course.
                  </Text>
                </View>

                <View style={styles.topControlsRow}>
                  <View style={styles.floorToggleWrap}>
                    <Pressable
                      style={[
                        styles.floorButton,
                        {
                          backgroundColor: theme.inputBg,
                          borderColor: theme.inputBorder,
                        },
                        selectedFloor === 1 && {
                          backgroundColor: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                        },
                      ]}
                      onPress={() => setSelectedFloor(1)}
                    >
                      <Text
                        style={[
                          styles.floorButtonText,
                          {
                            color:
                              selectedFloor === 1 ? theme.buttonText : theme.text,
                          },
                        ]}
                      >
                        1st Floor
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.floorButton,
                        {
                          backgroundColor: theme.inputBg,
                          borderColor: theme.inputBorder,
                        },
                        selectedFloor === 2 && {
                          backgroundColor: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                        },
                      ]}
                      onPress={() => setSelectedFloor(2)}
                    >
                      <Text
                        style={[
                          styles.floorButtonText,
                          {
                            color:
                              selectedFloor === 2 ? theme.buttonText : theme.text,
                          },
                        ]}
                      >
                        2nd Floor
                      </Text>
                    </Pressable>
                  </View>

                  <View style={styles.zoomControls}>
                    <Pressable
                      style={[
                        styles.smallButton,
                        {
                          backgroundColor: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                        },
                      ]}
                      onPress={zoomOut}
                    >
                      <Text
                        style={[styles.smallButtonText, { color: theme.buttonText }]}
                      >
                        −
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.smallButton,
                        {
                          backgroundColor: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                        },
                      ]}
                      onPress={resetView}
                    >
                      <Text
                        style={[styles.smallButtonText, { color: theme.buttonText }]}
                      >
                        Reset View
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.smallButton,
                        {
                          backgroundColor: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                        },
                      ]}
                      onPress={zoomIn}
                    >
                      <Text
                        style={[styles.smallButtonText, { color: theme.buttonText }]}
                      >
                        ＋
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: theme.buttonBg,
                        borderColor: theme.buttonBorder,
                      },
                    ]}
                    onPress={() => setChooseLocationMode(!chooseLocationMode)}
                  >
                    <Text
                      style={[styles.actionButtonText, { color: theme.buttonText }]}
                    >
                      {chooseLocationMode
                        ? "Tap a room to set location"
                        : currentLocation
                        ? "Change My Location"
                        : "Set My Location"}
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
                    onPress={clearRoute}
                  >
                    <Text
                      style={[styles.actionButtonText, { color: theme.buttonText }]}
                    >
                      Clear Route
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.infoWrap}>
                  <View
                    style={[
                      styles.infoBubble,
                      {
                        backgroundColor: theme.infoBg,
                        borderColor: theme.infoBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.infoLabel, { color: theme.infoTitle }]}>
                      Current Location
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.infoText }]}>
                      {currentLocationRoom
                        ? `${currentLocationRoom.id} — ${currentLocationRoom.name} (Floor ${currentLocation?.floor})`
                        : "Not chosen yet"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.infoBubble,
                      {
                        backgroundColor: theme.infoBg,
                        borderColor: theme.infoBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.infoLabel, { color: theme.infoTitle }]}>
                      Destination
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.infoText }]}>
                      {selectedRoom
                        ? `${selectedRoom.id} — ${selectedRoom.name} (Floor ${selectedDestination?.floor})`
                        : "Not chosen yet"}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.mapBox,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                    },
                  ]}
                >
                  {renderMap()}
                </View>
              </View>
            </View>

            <View style={styles.sideSection}>
              <View
                style={[
                  styles.sideCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.sideTitle, { color: theme.title }]}>
                  Directions
                </Text>

                {!currentLocation || !selectedDestination ? (
                  <Text style={[styles.sideSubtitle, { color: theme.text }]}>
                    Pick your location first, then choose a destination room or
                    saved course.
                  </Text>
                ) : currentLocation.floor !== 1 || selectedDestination.floor !== 1 ? (
                  <Text style={[styles.sideSubtitle, { color: theme.text }]}>
                    Floor 2 now appears in the UI and rooms can be selected there.
                    Route lines and turn-by-turn steps are currently connected to
                    the first-floor path graph only.
                  </Text>
                ) : !routeSummary ? (
                  <Text style={[styles.sideSubtitle, { color: theme.text }]}>
                    No route could be built for that room pair yet.
                  </Text>
                ) : (
                  <>
                    <Text style={[styles.courseText, { color: theme.text }]}>
                      From: {routeSummary.from}
                    </Text>

                    <Text
                      style={[
                        styles.courseText,
                        { color: theme.text, marginBottom: 10 },
                      ]}
                    >
                      To: {routeSummary.to}
                    </Text>

                    <View
                      style={[
                        styles.directionCard,
                        {
                          backgroundColor: theme.bubbleBg,
                          borderColor: theme.bubbleBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.directionStat, { color: theme.title }]}>
                        Straight-line distance:{" "}
                        {routeSummary.straightLineDistanceMeters} m
                      </Text>
                      <Text style={[styles.directionStat, { color: theme.title }]}>
                        Total walking distance: {routeSummary.totalDistanceMeters} m
                      </Text>
                    </View>

                    {routeSummary.steps.map((step, index) => (
                      <View
                        key={`step-${index}`}
                        style={[
                          styles.directionCard,
                          {
                            backgroundColor: theme.bubbleBg,
                            borderColor: theme.bubbleBorder,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.directionStepTitle, { color: theme.title }]}
                        >
                          {index === 0 ? "Start" : `Step ${index}`}
                        </Text>
                        <Text style={[styles.courseText, { color: theme.text }]}>
                          {step.text}
                        </Text>
                        <Text style={[styles.courseText, { color: theme.subtext }]}>
                          Walk {step.distanceMeters} m
                        </Text>
                      </View>
                    ))}

                    <Text
                      style={[
                        styles.arrivalText,
                        { color: settings.darkMode ? "#86efac" : "#157347" },
                      ]}
                    >
                      Arrived at destination
                    </Text>
                  </>
                )}
              </View>

              <View
                style={[
                  styles.sideCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                    marginTop: 16,
                  },
                ]}
              >
                <Text style={[styles.sideTitle, { color: theme.title }]}>
                  Saved Courses
                </Text>
                <Text style={[styles.sideSubtitle, { color: theme.text }]}>
                  Sorted by start time. Tap a course to highlight its room.
                </Text>

                {sortedCourses.length === 0 ? (
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
                  sortedCourses.map((course) => {
                    const courseRoomId = roomIdFromSavedCourse(course.room);

                    const isActive =
                      selectedDestination?.floor === 1 &&
                      selectedDestination.roomId === courseRoomId;

                    const colorSet = getCourseDayColorSet(
                      course.days,
                      settings.showCourseColors,
                      settings.darkMode
                    );

                    return (
                      <Pressable
                        key={course.id}
                        onPress={() => handleSavedCoursePress(course)}
                        style={[
                          styles.courseCard,
                          {
                            backgroundColor: colorSet.backgroundColor,
                            borderColor: colorSet.borderColor,
                          },
                          isActive && styles.courseCardActive,
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
  },

  background: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 120,
  },

  titleCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
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
    borderWidth: 2,
    borderRadius: 28,
    padding: 18,
  },

  sideCard: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 18,
  },

  mapHeaderRow: {
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 15,
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
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  floorButtonText: {
    fontWeight: "800",
    fontSize: 14,
  },

  zoomControls: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  smallButton: {
    borderWidth: 2,
    borderRadius: 999,
    minWidth: 52,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  smallButtonText: {
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
    marginBottom: 14,
  },

  infoBubble: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 12,
    minWidth: 220,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  mapBox: {
    height: 680,
    borderRadius: 24,
    borderWidth: 2,
    overflow: "hidden",
    padding: 10,
  },

  mapScrollContent: {
    alignItems: "flex-start",
  },

  sideTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },

  sideSubtitle: {
    fontSize: 14,
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

  directionCard: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },

  directionStepTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  directionStat: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  arrivalText: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
});