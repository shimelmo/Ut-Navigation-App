// ==========================================================
// HomeScreen.tsx
// Main map screen for UT Campus Compass
//
// What this screen does:
// - Shows the campus map for Floor 1 or Floor 2
// - Lets the user choose their current location
// - Lets the user choose a destination room
// - Draws a route between start and destination
// - Shows turn-by-turn style route summary text
// - Displays saved courses and lets the user tap one to jump to its room
// - Supports zooming and switching floors
// - Applies dark mode / user theme settings
// ==========================================================

import AIBubble from "@/components/AIBubble"; // Floating AI bubble shown on top of the screen
import TopTabs from "@/components/TopTabs"; // Top navigation tabs

// Floor 2 map data and room type
import {
  MAP2_H,
  MAP2_W,
  Room2,
  ROOMS_FLOOR_2,
} from "@/data/floor2MapData";

// Floor 1 map data and helper for room styling
import {
  getRoomStyles,
  MAP_H,
  MAP_W,
  Room,
  ROOMS
} from "@/data/floorMapData";

// App theme + user settings helpers
import {
  appThemes,
  defaultSettings,
  loadUserSettings,
  UserSettings,
} from "@/utils/appSettings";

// Used to color saved course cards based on meeting days
import { getCourseDayColorSet } from "@/utils/courseColors";

// Pathfinding helpers:
// - findRoute gives the points to draw on the map
// - buildRouteSummary gives readable directions text
import { buildRouteSummary, findRoute } from "@/utils/pathfinding";

// AsyncStorage is used to load saved courses from device storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Runs logic each time this screen comes back into focus
import { useFocusEffect } from "@react-navigation/native";

// React hooks
import React, { useCallback, useEffect, useMemo, useState } from "react";

// React Native UI components
import {
  LayoutChangeEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// SVG elements used to draw the map, route, highlights, and labels
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";


// Amount to shrink the visible room rectangle inward
// This makes rooms look cleaner and creates a little spacing around them
const ROOM_INSET = 26;

// Thickness of the route line drawn between points
const ROUTE_STROKE_WIDTH = 8;


// A saved course object loaded from AsyncStorage
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

// Only 2 floors exist in this screen right now
type FloorNumber = 1 | 2;

// Represents a selected room on a specific floor
type RoomSelection = {
  floor: FloorNumber;
  roomId: string;
};

// AsyncStorage key used to save and load courses
const STORAGE_KEY = "saved_courses";

export default function HomeScreen() {
  // -------------------------------
  // STATE
  // -------------------------------

  // All saved courses loaded from local storage
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);

  // The currently selected destination room
  const [selectedDestination, setSelectedDestination] =
    useState<RoomSelection | null>(null);

  // The current starting room / user location
  const [currentLocation, setCurrentLocation] =
    useState<RoomSelection | null>(null);

  // When true, the next room tap sets the current location instead of destination
  const [chooseLocationMode, setChooseLocationMode] = useState(false);

  // Current zoom level for the map
  const [zoom, setZoom] = useState(0.58);

  // Which floor is currently visible
  const [selectedFloor, setSelectedFloor] = useState<FloorNumber>(1);

  // User settings such as dark mode, course colors, etc.
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // The visible size of the map container on screen
  // Used to automatically calculate the best zoom-to-fit value
  const [mapViewportWidth, setMapViewportWidth] = useState(0);
  const [mapViewportHeight, setMapViewportHeight] = useState(0);

  // Pick the correct app theme based on dark mode setting
  const theme = settings.darkMode ? appThemes.dark : appThemes.light;


  // -------------------------------
  // DATA LOADING
  // -------------------------------

  // Load saved courses from AsyncStorage
  const loadSavedCourses = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      // If data exists, parse it into the saved courses state
      if (stored) {
        setSavedCourses(JSON.parse(stored));
      } else {
        // If nothing is stored, keep it as an empty list
        setSavedCourses([]);
      }
    } catch (error) {
      console.log("Could not load saved courses:", error);
      setSavedCourses([]);
    }
  }, []);

  // Load saved user settings from appSettings helper
  const loadSettings = useCallback(async () => {
    const userSettings = await loadUserSettings();
    setSettings(userSettings);
  }, []);

  // Load data when the screen first mounts
  useEffect(() => {
    loadSavedCourses();
    loadSettings();
  }, [loadSavedCourses, loadSettings]);

  // Reload data whenever the screen becomes active again
  // This helps reflect updated courses or settings right away
  useFocusEffect(
    useCallback(() => {
      loadSavedCourses();
      loadSettings();
    }, [loadSavedCourses, loadSettings])
  );


  // -------------------------------
  // DERIVED / CALCULATED VALUES
  // -------------------------------

  // Sort saved courses by start time so they appear in time order
  const sortedCourses = useMemo(() => {
    return [...savedCourses].sort((a, b) => {
      const aTime = Number(a.beginTime || "9999");
      const bTime = Number(b.beginTime || "9999");
      return aTime - bTime;
    });
  }, [savedCourses]);

  // Pick which room list to show based on the current floor
  const visibleRooms = useMemo(() => {
    return selectedFloor === 1 ? ROOMS : ROOMS_FLOOR_2;
  }, [selectedFloor]);

  // Pick map dimensions based on the selected floor
  const activeMapWidth = selectedFloor === 1 ? MAP_W : MAP2_W;
  const activeMapHeight = selectedFloor === 1 ? MAP_H : MAP2_H;

  // Calculate the zoom level needed to fit the whole map into the visible map box
  const fitZoom = useMemo(() => {
    if (!mapViewportWidth || !mapViewportHeight) return 0.3;

    const horizontalFit = (mapViewportWidth - 20) / activeMapWidth;
    const verticalFit = (mapViewportHeight - 20) / activeMapHeight;

    // Use the smaller of the two so the map fully fits both horizontally and vertically
    return Math.min(horizontalFit, verticalFit);
  }, [mapViewportWidth, mapViewportHeight, activeMapWidth, activeMapHeight]);

  // Whenever fitZoom changes or the floor changes, reset zoom to match the map nicely
  useEffect(() => {
    if (fitZoom > 0) {
      setZoom(fitZoom);
    }
  }, [fitZoom, selectedFloor]);

  // Turn currentLocation into the full room object so we can show room name and other info
  const currentLocationRoom = useMemo(() => {
    if (!currentLocation) return null;

    if (currentLocation.floor === 1) {
      return ROOMS.find((room) => room.id === currentLocation.roomId) || null;
    }

    return (
      ROOMS_FLOOR_2.find((room) => room.id === currentLocation.roomId) || null
    );
  }, [currentLocation]);

  // Turn selectedDestination into the full room object
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

  // Calculate the actual route points to draw on the map
  const routePoints = useMemo(() => {
    if (!currentLocation || !selectedDestination) return null;

    // Cross-floor routing is not supported yet
    if (currentLocation.floor !== selectedDestination.floor) {
      return null;
    }

    return findRoute(
      currentLocation.roomId,
      selectedDestination.roomId,
      currentLocation.floor
    );
  }, [currentLocation, selectedDestination]);

  // Build the readable directions summary from the route points
  const routeSummary = useMemo(() => {
    if (!routePoints || !currentLocationRoom || !selectedRoom) return null;

    return buildRouteSummary(
      routePoints,
      `${currentLocationRoom.id} (${currentLocationRoom.name})`,
      `${selectedRoom.id} (${selectedRoom.name})`
    );
  }, [routePoints, currentLocationRoom, selectedRoom]);


  // -------------------------------
  // HELPER FUNCTIONS
  // -------------------------------

  // Convert a time like "0930" into "9:30 AM"
  const formatTime = (time: string) => {
    if (!time || time.length < 3) return time;

    const clean = time.padStart(4, "0");
    const hour = parseInt(clean.slice(0, 2), 10);
    const minute = clean.slice(2);
    const amOrPm = hour >= 12 ? "PM" : "AM";
    const convertedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${convertedHour}:${minute} ${amOrPm}`;
  };

  // Turn an array of day codes into a readable string
  const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return "No days listed";
    return days.join(", ");
  };

  // Convert a saved course room like "NE 2101" into "2101"
  const roomIdFromSavedCourse = (room: string) =>
    room.replace("NE ", "").trim().toUpperCase();

  // Normalize room ids before comparing them
  const normalizeRoomId = (room: string) =>
    room.replace("NE ", "").trim().toUpperCase();


  // -------------------------------
  // INTERACTION HANDLERS
  // -------------------------------

  // Called when a room on the map is pressed
  const handleRoomPress = (roomId: string) => {
    // If user is in "choose my location" mode,
    // or no location has ever been chosen yet,
    // then set this room as the starting point
    if (chooseLocationMode || !currentLocation) {
      setCurrentLocation({
        floor: selectedFloor,
        roomId,
      });

      setChooseLocationMode(false);
      return;
    }

    // Otherwise this tap selects the destination
    setSelectedDestination({
      floor: selectedFloor,
      roomId,
    });
  };

  // Called when a saved course card is pressed
  const handleSavedCoursePress = (course: SavedCourse) => {
    // Convert the course room text into the simple room id used by map data
    const roomId = roomIdFromSavedCourse(course.room);

    // Try to find matching room on floor 1
    const foundRoomFloor1 = ROOMS.find(
      (room) => room.id.toUpperCase() === roomId.toUpperCase()
    );

    // Try to find matching room on floor 2
    const foundRoomFloor2 = ROOMS_FLOOR_2.find(
      (room) => room.id.toUpperCase() === roomId.toUpperCase()
    );

    // Look at building text to decide if floor 2 should be preferred
    const buildingText = (course.building || "").toUpperCase();
    const shouldPreferFloor2 =
      buildingText.includes("2") ||
      buildingText.includes("SECOND") ||
      buildingText.includes("FLOOR 2") ||
      roomId.startsWith("21");

    let targetFloor: FloorNumber | null = null;
    let targetRoomId = "";

    // Choose best matching floor + room
    if (shouldPreferFloor2 && foundRoomFloor2) {
      targetFloor = 2;
      targetRoomId = foundRoomFloor2.id;
    } else if (foundRoomFloor1) {
      targetFloor = 1;
      targetRoomId = foundRoomFloor1.id;
    } else if (foundRoomFloor2) {
      targetFloor = 2;
      targetRoomId = foundRoomFloor2.id;
    } else {
      // If no room matches at all, stop
      return;
    }

    // Switch the visible map to the correct floor
    setSelectedFloor(targetFloor);

    // If the course is already selected, tapping it again will unselect it
    if (
      selectedDestination &&
      selectedDestination.floor === targetFloor &&
      selectedDestination.roomId.toUpperCase() === targetRoomId.toUpperCase()
    ) {
      setSelectedDestination(null);
      return;
    }

    // Otherwise select it as the new destination
    setSelectedDestination({
      floor: targetFloor,
      roomId: targetRoomId,
    });
  };

  // Clear only the destination and exit choose-location mode
  const clearRoute = () => {
    setSelectedDestination(null);
    setChooseLocationMode(false);
  };

  // Increase zoom but stop at a max value
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2.2));
  };

  // Decrease zoom but do not let it get too tiny
  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, Math.max(fitZoom * 0.55, 0.12)));
  };

  // Reset zoom back to the calculated fit amount
  const resetView = () => {
    setZoom(fitZoom || 0.3);
  };


  // -------------------------------
  // MAP DRAWING VALUES
  // -------------------------------

  // Actual rendered SVG size after zoom is applied
  const mapWidth = activeMapWidth * zoom;
  const mapHeight = activeMapHeight * zoom;

  // Draw the room id label inside a room box
  const renderRoomLabel = (room: Room | Room2) => {
    const textY = room.y + room.h / 2;

    // Smaller rooms use smaller text so labels fit better
    const fontSize =
      room.w < 90 || room.h < 60 ? 14 : room.w < 150 ? 18 : 22;

    return (
      <SvgText
        x={room.x + room.w / 2}
        y={textY}
        fontSize={fontSize}
        fill={getRoomStyles(settings.darkMode)[room.type].tc}
        textAnchor="middle"
      >
        {room.id}
      </SvgText>
    );
  };

  // Only draw route if both start and destination exist,
  // they are on the same floor,
  // and the visible floor matches that route floor
  const shouldDrawRoute =
    !!routePoints &&
    !!currentLocation &&
    !!selectedDestination &&
    currentLocation.floor === selectedDestination.floor &&
    selectedFloor === currentLocation.floor;

  // Draw the map area with SVG inside nested scroll views
  const renderMap = () => {
    return (
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mapScrollContent}
      >
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator
          contentContainerStyle={styles.mapInnerScrollContent}
        >
          <Svg
            width={mapWidth}
            height={mapHeight}
            viewBox={`0 0 ${activeMapWidth} ${activeMapHeight}`}
          >
            {/* Background fill for the map */}
            <Rect
              x={0}
              y={0}
              width={activeMapWidth}
              height={activeMapHeight}
              fill={settings.darkMode ? "#0f172a" : "#f4efe6"}
            />

            {/* Draw route line segment by segment */}
            {shouldDrawRoute
              ? routePoints.slice(0, -1).map((point, index) => {
                  const nextPoint = routePoints[index + 1];

                  return (
                    <Line
                      key={`line-${index}`}
                      x1={point.x}
                      y1={point.y}
                      x2={nextPoint.x}
                      y2={nextPoint.y}
                      stroke={settings.darkMode ? "#60a5fa" : "#d62828"}
                      strokeWidth={ROUTE_STROKE_WIDTH}
                      strokeLinecap="round"
                    />
                  );
                })
              : null}

            {/* Draw every visible room on the selected floor */}
            {visibleRooms.map((room) => {
              // Get the room style colors based on room type and dark mode
              const roomStyles = getRoomStyles(settings.darkMode);
              const roomStyle = roomStyles[room.type];

              // True if this room is the selected destination
              const isSelected =
                !!selectedDestination &&
                selectedDestination.floor === selectedFloor &&
                selectedDestination.roomId.toUpperCase() === room.id.toUpperCase();

              // True if this room is the starting location
              const isStart =
                currentLocation?.floor === selectedFloor &&
                currentLocation.roomId === room.id;

              // Shrink room box inward, but not too much
              const inset = Math.min(
                ROOM_INSET,
                Math.max(6, room.w * 0.18),
                Math.max(6, room.h * 0.18)
              );

              // Adjusted room drawing size/position after inset
              const drawX = room.x + inset / 2;
              const drawY = room.y + inset / 2;
              const drawW = Math.max(8, room.w - inset);
              const drawH = Math.max(8, room.h - inset);

              return (
                <React.Fragment key={`${selectedFloor}-${room.id}`}>
                  {/* Main visible room rectangle */}
                  <Rect
                    x={drawX}
                    y={drawY}
                    width={drawW}
                    height={drawH}
                    fill={
                      isSelected
                        ? "#ffe59c" // yellow highlight for destination
                        : isStart
                        ? "#cdeccf" // green highlight for start
                        : roomStyle.fill // normal room color
                    }
                    stroke={
                      isSelected
                        ? "#ff9f1a" // orange outline for destination
                        : isStart
                        ? "#2f8f46" // green outline for start
                        : roomStyle.edge // normal room border
                    }
                    strokeWidth={isSelected || isStart ? 4 : 2}
                    rx={4}
                    onPress={() => handleRoomPress(room.id)}
                  />

                  {/* Room number label */}
                  {renderRoomLabel(room)}

                  {/* Start-room marker */}
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

                  {/* Destination marker */}
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


  // -------------------------------
  // UI
  // -------------------------------

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <View style={[styles.background, { backgroundColor: theme.screenBg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top tab navigation */}
          <TopTabs settings={settings} />

          {/* Screen title card */}
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
            {/* Left / top main map area */}
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
                {/* Card heading + instructions */}
                <View style={styles.mapHeaderRow}>
                  <Text style={[styles.cardTitle, { color: theme.title }]}>
                    Map Display
                  </Text>
                  <Text style={[styles.cardText, { color: theme.text }]}>
                    Tap “Set My Location,” then tap a room. After that, tap any
                    destination room or a saved course.
                  </Text>
                </View>

                {/* Floor buttons + zoom buttons */}
                <View style={styles.topControlsRow}>
                  <View style={styles.floorToggleWrap}>
                    {/* Floor 1 button */}
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

                    {/* Floor 2 button */}
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

                  {/* Zoom controls */}
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

                {/* Location / clear buttons */}
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

                {/* Current location + destination info bubbles */}
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

                {/* Map container.
                    onLayout gives the visible size so fitZoom can be calculated. */}
                <View
                  onLayout={(event: LayoutChangeEvent) => {
                    const { width, height } = event.nativeEvent.layout;
                    setMapViewportWidth(width);
                    setMapViewportHeight(height);
                  }}
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

            {/* Right / bottom sidebar content */}
            <View style={styles.sideSection}>
              {/* Directions panel */}
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

                {/* Show help text if start or destination is missing */}
                {!currentLocation || !selectedDestination ? (
                  <Text style={[styles.sideSubtitle, { color: theme.text }]}>
                    Pick your location first, then choose a destination room or
                    saved course.
                  </Text>
                ) : currentLocation.floor !== selectedDestination.floor ? (
                  // Cross-floor routing not supported yet
                  <Text style={[styles.sideSubtitle, { color: theme.text }]}>
                    Start and destination need to be on the same floor right now.
                  </Text>
                ) : !routeSummary ? (
                  // Route algorithm could not build a path
                  <Text style={[styles.sideSubtitle, { color: theme.text }]}>
                    No route could be built for that room pair yet.
                  </Text>
                ) : (
                  // Show route summary if available
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

                    {/* Distance summary */}
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

                    {/* Route steps */}
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

                    {/* Final arrival message */}
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

              {/* Saved courses panel */}
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

                {/* Empty state if no courses are saved */}
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
                  // Otherwise render each saved course card
                  sortedCourses.map((course) => {
                    const courseRoomId = roomIdFromSavedCourse(course.room);

                    // Highlight the course card if its room matches the selected destination
                    const isActive =
                      !!selectedDestination &&
                      normalizeRoomId(selectedDestination.roomId) ===
                        normalizeRoomId(courseRoomId);

                    // Get the color theme for this course card
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

        {/* Floating AI button shown on top of everything */}
        <AIBubble />
      </View>
    </SafeAreaView>
  );
}


// -------------------------------
// STYLES
// -------------------------------

const styles = StyleSheet.create({
  // Outer safe area wrapper
  safeArea: {
    flex: 1,
  },

  // Main screen background
  background: {
    flex: 1,
  },

  // Padding for the main scroll area
  scrollContent: {
    padding: 18,
    paddingBottom: 120,
  },

  // Title / subtitle card at the top
  titleCard: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  // App title text
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
  },

  // Subtitle under the title
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Wraps the map section and side section
  mainGrid: {
    gap: 16,
  },

  // Main map area
  mapSection: {
    width: "100%",
  },

  // Sidebar area
  sideSection: {
    width: "100%",
  },

  // Main map card
  mainCard: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 18,
  },

  // Shared card style for sidebar sections
  sideCard: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 18,
  },

  // Header area above map
  mapHeaderRow: {
    marginBottom: 14,
  },

  // Card heading text
  cardTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  // Card body text
  cardText: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Row holding floor buttons and zoom buttons
  topControlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  // Floor toggle button container
  floorToggleWrap: {
    flexDirection: "row",
    gap: 8,
  },

  // Individual floor button
  floorButton: {
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  // Floor button text
  floorButtonText: {
    fontWeight: "800",
    fontSize: 14,
  },

  // Zoom control button row
  zoomControls: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  // Small round-ish control buttons
  smallButton: {
    borderWidth: 2,
    borderRadius: 999,
    minWidth: 52,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  // Text inside small buttons
  smallButtonText: {
    fontWeight: "800",
    fontSize: 14,
  },

  // Row for location and clear buttons
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  // Main action button style
  actionButton: {
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  // Action button text
  actionButtonText: {
    fontSize: 15,
    fontWeight: "800",
  },

  // Wrap for current location and destination bubbles
  infoWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  // Info bubble card
  infoBubble: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 12,
    minWidth: 220,
  },

  // Small uppercase label in info bubbles
  infoLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  // Main info value text
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Map display box
  mapBox: {
    height: 760,
    borderRadius: 24,
    borderWidth: 2,
    overflow: "hidden",
    padding: 10,
  },

  // Outer scroll area for the map
  mapScrollContent: {
    alignItems: "flex-start",
  },

  // Inner scroll area for the map
  mapInnerScrollContent: {
    alignItems: "flex-start",
  },

  // Sidebar title text
  sideTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },

  // Sidebar helper text
  sideSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  // Saved course card
  courseCard: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },

  // Extra border styling when a course is active / selected
  courseCardActive: {
    borderColor: "#ff9f1a",
  },

  // Course title text
  courseTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  // General course / directions text
  courseText: {
    fontSize: 14,
    marginBottom: 2,
  },

  // Small card used in directions panel
  directionCard: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },

  // "Start", "Step 1", etc.
  directionStepTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  // Stats like distance
  directionStat: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  // Final arrival text
  arrivalText: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
});
