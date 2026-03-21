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
  { id: "2101", name: "2101", type: "lab", x: 38, y: 38, w: 200, h: 130 },
  { id: "2102", name: "2102", type: "lab", x: 238, y: 38, w: 200, h: 130 },
  { id: "1119", name: "1119", type: "utility", x: 438, y: 38, w: 150, h: 130 },

  { id: "2103", name: "2103", type: "lab", x: 38, y: 168, w: 150, h: 200 },
  { id: "2100", name: "Computer Lab 2100", type: "comp", x: 188, y: 168, w: 300, h: 200 },
  { id: "2122", name: "2122", type: "lab", x: 488, y: 168, w: 200, h: 200 },
  { id: "2123", name: "2123", type: "lab", x: 688, y: 168, w: 180, h: 200 },
  { id: "2124", name: "2124", type: "lab", x: 868, y: 168, w: 180, h: 200 },

  { id: "2120", name: "2120", type: "lab", x: 38, y: 368, w: 150, h: 150 },
  { id: "2121", name: "2121", type: "lab", x: 188, y: 368, w: 300, h: 150 },
  { id: "2125", name: "2125", type: "office", x: 488, y: 368, w: 180, h: 150 },

  { id: "2104", name: "Computer Lab 2104", type: "comp", x: 38, y: 518, w: 175, h: 160 },
  { id: "2105", name: "Computer Lab 2105", type: "comp", x: 213, y: 518, w: 175, h: 160 },
  { id: "2106", name: "Computer Lab 2106", type: "comp", x: 388, y: 518, w: 175, h: 160 },
  { id: "2108", name: "Computer Lab 2108", type: "comp", x: 563, y: 518, w: 195, h: 160 },
  { id: "2109", name: "Computer Lab 2109", type: "comp", x: 758, y: 518, w: 195, h: 160 },
];

export const F2_NODES: Record<string, { x: number; y: number }> = {
  f2_l: { x: 38, y: 440 },
  f2_m: { x: 450, y: 440 },
  f2_r: { x: 950, y: 440 },
  f2_t: { x: 450, y: 200 },
  f2_b: { x: 450, y: 620 },
  f2_tl: { x: 100, y: 100 },
  f2_tr: { x: 700, y: 100 },
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