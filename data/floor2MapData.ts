// Import the RoomType type from floorMapData.ts
// so floor 2 can reuse the same room categories
// like "lab", "office", "utility", etc.
import { RoomType } from "@/data/floorMapData";


// This type describes one room on floor 2.
// Each room has:
// - an id like "2101"
// - a display name
// - a room type
// - x/y position on the map
// - width and height
export type Room2 = {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  y: number;
  w: number;
  h: number;
};


// Width of the floor 2 SVG map
export const MAP2_W = 1100;

// Height of the floor 2 SVG map
export const MAP2_H = 780;


// Main list of every room on floor 2.
// Each object tells the app where the room is drawn
// and what kind of room it is.
export const ROOMS_FLOOR_2: Room2[] = [
  // Top row
  { id: "2101", name: "2101 Research Lab", type: "lab", x: 38, y: 38, w: 200, h: 130 },
  { id: "2102", name: "2102 Research Lab", type: "lab", x: 248, y: 38, w: 210, h: 130 },
  { id: "1119", name: "1119 Storage", type: "utility", x: 468, y: 38, w: 150, h: 130 },

  // Middle upper row
  { id: "2103", name: "2103 Research Lab", type: "lab", x: 38, y: 178, w: 155, h: 210 },
  { id: "2100", name: "Computer Lab 2100", type: "bio", x: 203, y: 178, w: 320, h: 210 },
  { id: "2122", name: "2122 Research Lab", type: "lab", x: 533, y: 178, w: 205, h: 210 },
  { id: "2123", name: "2123 Research Lab", type: "lab", x: 748, y: 178, w: 185, h: 210 },
  { id: "2124", name: "2124 Research Lab", type: "lab", x: 943, y: 178, w: 155, h: 210 },

  // Middle lower row
  { id: "2120", name: "2120 Research Lab", type: "lab", x: 38, y: 398, w: 155, h: 155 },
  { id: "2121", name: "2121 Research Lab", type: "lab", x: 203, y: 398, w: 320, h: 155 },
  { id: "2125", name: "2125 Faculty Office", type: "office", x: 533, y: 398, w: 185, h: 155 },

  // Bottom row
  { id: "2104", name: "Computer Lab 2104", type: "comp", x: 38, y: 563, w: 185, h: 170 },
  { id: "2105", name: "Computer Lab 2105", type: "comp", x: 233, y: 563, w: 185, h: 170 },
  { id: "2106", name: "Computer Lab 2106", type: "comp", x: 428, y: 563, w: 185, h: 170 },
  { id: "2108", name: "Computer Lab 2108", type: "comp", x: 623, y: 563, w: 205, h: 170 },
  { id: "2109", name: "Computer Lab 2109", type: "comp", x: 838, y: 563, w: 195, h: 170 },
];


// Fast lookup table for floor 2 rooms.
// This lets the app quickly do:
// ROOM2_BY_ID["2101"]
// instead of searching through the whole array every time.
export const ROOM2_BY_ID: Record<string, Room2> = Object.fromEntries(
  ROOMS_FLOOR_2.map((room) => [room.id, room])
);


// Helper function to get the center point of a room.
// This is useful for map calculations and route drawing.
export const roomCenterFloor2 = (roomId: string) => {
  // Find the room object from its id
  const room = ROOM2_BY_ID[roomId];

  // Return the center x and center y
  return { x: room.x + room.w / 2, y: room.y + room.h / 2 };
};


/*
  Floor 2 hallway graph

  These nodes are invisible pathfinding points placed in the hallways.
  The route system uses these points to figure out how to travel
  through open walking spaces instead of drawing lines straight
  through room rectangles.

  In other words:
  - rooms are the visible boxes
  - nodes are invisible hallway anchors
  - edges connect those hallway anchors together
*/


// Hallway nodes for floor 2.
// Each node is a point in the hallway that pathfinding can travel through.
export const F2_NODES: Record<string, { x: number; y: number }> = {
  // Top hallway:
  // This hallway sits between the top row rooms
  // and the row below them.
  f2_t_2101: { x: 138, y: 173 },
  f2_t_2102: { x: 353, y: 173 },
  f2_t_1119: { x: 543, y: 173 },

  // Left vertical hallway:
  // This connects top hallway down toward rooms 2103 and 2120.
  f2_v_left_top: { x: 198, y: 173 },
  f2_v_left_mid: { x: 198, y: 393 },

  // Middle vertical hallway:
  // This connects the top hallway, middle hallway, and bottom hallway.
  f2_v_mid_top: { x: 528, y: 173 },
  f2_v_mid_mid: { x: 528, y: 393 },
  f2_v_mid_bot: { x: 528, y: 558 },

  // Middle hallway:
  // This hallway sits between the middle room row
  // and the row below it.
  f2_m_2100: { x: 363, y: 393 },
  f2_m_2122: { x: 635, y: 393 },
  f2_m_2123: { x: 840, y: 393 },
  f2_m_2124: { x: 1020, y: 393 },

  // Bottom hallway:
  // This hallway sits between the middle-lower row
  // and the bottom row of computer labs.
  f2_b_2120: { x: 115, y: 558 },
  f2_b_2121: { x: 363, y: 558 },
  f2_b_2125: { x: 625, y: 558 },
  f2_b_2108: { x: 725, y: 558 },
  f2_b_2109: { x: 935, y: 558 },

  // Right-side connector:
  // This helps route paths cleanly between 2124 and 2109.
  f2_v_right_top: { x: 1020, y: 393 },
  f2_v_right_bot: { x: 935, y: 558 },
};


// Hallway edges for floor 2.
// Each pair means those two nodes are directly connected by a walkable hallway segment.
export const F2_EDGES: [string, string][] = [
  // Top hallway connections
  ["f2_t_2101", "f2_v_left_top"],
  ["f2_v_left_top", "f2_t_2102"],
  ["f2_t_2102", "f2_v_mid_top"],
  ["f2_v_mid_top", "f2_t_1119"],

  // Left vertical hallway connection
  ["f2_v_left_top", "f2_v_left_mid"],

  // Middle vertical hallway connections
  ["f2_v_mid_top", "f2_v_mid_mid"],
  ["f2_v_mid_mid", "f2_v_mid_bot"],

  // Middle hallway connections
  ["f2_v_left_mid", "f2_m_2100"],
  ["f2_m_2100", "f2_v_mid_mid"],
  ["f2_v_mid_mid", "f2_m_2122"],
  ["f2_m_2122", "f2_m_2123"],
  ["f2_m_2123", "f2_m_2124"],

  // Bottom hallway connections
  ["f2_b_2120", "f2_b_2121"],
  ["f2_b_2121", "f2_v_mid_bot"],
  ["f2_v_mid_bot", "f2_b_2125"],
  ["f2_b_2125", "f2_b_2108"],
  ["f2_b_2108", "f2_b_2109"],

  // Right-side shortcut/connector
  ["f2_m_2124", "f2_b_2109"],
];


// Door map for floor 2.
// This tells the pathfinding system which hallway node each room should connect to.
// So when routing to a room, the app knows what hallway point acts like its doorway.
export const F2_DOOR: Record<string, string> = {
  // Top row rooms connect to top hallway
  "2101": "f2_t_2101",
  "2102": "f2_t_2102",
  "1119": "f2_t_1119",

  // Middle upper row rooms
  "2103": "f2_v_left_mid",
  "2100": "f2_m_2100",
  "2122": "f2_m_2122",
  "2123": "f2_m_2123",
  "2124": "f2_m_2124",

  // Middle lower row rooms
  "2120": "f2_b_2120",
  "2121": "f2_b_2121",
  "2125": "f2_b_2125",

  // Bottom row rooms
  "2104": "f2_b_2120",
  "2105": "f2_b_2121",
  "2106": "f2_v_mid_bot",
  "2108": "f2_b_2108",
  "2109": "f2_b_2109",
};