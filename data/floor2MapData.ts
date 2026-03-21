import { RoomType } from "@/data/floorMapData";

export type Room2 = {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const MAP2_W = 1100;
export const MAP2_H = 780;

export const ROOMS_FLOOR_2: Room2[] = [
  { id: "2101", name: "2101 Research Lab", type: "lab", x: 38, y: 38, w: 200, h: 130 },
  { id: "2102", name: "2102 Research Lab", type: "lab", x: 248, y: 38, w: 210, h: 130 },
  { id: "1119", name: "1119 Storage", type: "utility", x: 468, y: 38, w: 150, h: 130 },

  { id: "2103", name: "2103 Research Lab", type: "lab", x: 38, y: 178, w: 155, h: 210 },
  { id: "2100", name: "Computer Lab 2100", type: "bio", x: 203, y: 178, w: 320, h: 210 },
  { id: "2122", name: "2122 Research Lab", type: "lab", x: 533, y: 178, w: 205, h: 210 },
  { id: "2123", name: "2123 Research Lab", type: "lab", x: 748, y: 178, w: 185, h: 210 },
  { id: "2124", name: "2124 Research Lab", type: "lab", x: 943, y: 178, w: 155, h: 210 },

  { id: "2120", name: "2120 Research Lab", type: "lab", x: 38, y: 398, w: 155, h: 155 },
  { id: "2121", name: "2121 Research Lab", type: "lab", x: 203, y: 398, w: 320, h: 155 },
  { id: "2125", name: "2125 Faculty Office", type: "office", x: 533, y: 398, w: 185, h: 155 },

  { id: "2104", name: "Computer Lab 2104", type: "comp", x: 38, y: 563, w: 185, h: 170 },
  { id: "2105", name: "Computer Lab 2105", type: "comp", x: 233, y: 563, w: 185, h: 170 },
  { id: "2106", name: "Computer Lab 2106", type: "comp", x: 428, y: 563, w: 185, h: 170 },
  { id: "2108", name: "Computer Lab 2108", type: "comp", x: 623, y: 563, w: 205, h: 170 },
  { id: "2109", name: "Computer Lab 2109", type: "comp", x: 838, y: 563, w: 195, h: 170 },
];

export const ROOM2_BY_ID: Record<string, Room2> = Object.fromEntries(
  ROOMS_FLOOR_2.map((room) => [room.id, room])
);

export const roomCenterFloor2 = (roomId: string) => {
  const room = ROOM2_BY_ID[roomId];
  return { x: room.x + room.w / 2, y: room.y + room.h / 2 };
};

export const F2_NODES: Record<string, { x: number; y: number }> = {
  f2_l: { x: 120, y: 470 },
  f2_m: { x: 450, y: 470 },
  f2_r: { x: 935, y: 470 },
  f2_t: { x: 450, y: 285 },
  f2_b: { x: 450, y: 648 },
  f2_tl: { x: 140, y: 110 },
  f2_tr: { x: 760, y: 110 },
};

export const F2_EDGES: [string, string][] = [
  ["f2_l", "f2_m"],
  ["f2_m", "f2_r"],
  ["f2_m", "f2_t"],
  ["f2_m", "f2_b"],
  ["f2_l", "f2_b"],
  ["f2_r", "f2_b"],
  ["f2_tl", "f2_t"],
  ["f2_t", "f2_tr"],
];

export const F2_DOOR: Record<string, string> = {
  "2101": "f2_tl",
  "2102": "f2_t",
  "1119": "f2_tr",
  "2103": "f2_l",
  "2100": "f2_t",
  "2122": "f2_m",
  "2123": "f2_tr",
  "2124": "f2_tr",
  "2120": "f2_l",
  "2121": "f2_m",
  "2125": "f2_m",
  "2104": "f2_b",
  "2105": "f2_b",
  "2106": "f2_b",
  "2108": "f2_r",
  "2109": "f2_r",
};