export type RoomType =
  | "lab"
  | "bio"
  | "class"
  | "comp"
  | "office"
  | "restroom"
  | "utility"
  | "stair"
  | "entrance"
  | "shop"
  | "maker"
  | "corridor";

export type Room = {
  id: string;
  name: string;
  type: RoomType;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const MAP_W = 1800;
export const MAP_H = 1380;
export const MPU = 0.054;

export const TYPES: Record<
  RoomType,
  { fill: string; edge: string; tc: string; label: string }
> = {
  lab: {
    fill: "#dce8f7",
    edge: "#90b8d8",
    tc: "#1a5276",
    label: "Research / Lab",
  },
  bio: {
    fill: "#e8f5e9",
    edge: "#81c784",
    tc: "#1b5e20",
    label: "Bio Lab (BSL2)",
  },
  class: {
    fill: "#fff3e0",
    edge: "#ffb74d",
    tc: "#7f4a00",
    label: "Classroom",
  },
  comp: {
    fill: "#e8eaf6",
    edge: "#9fa8da",
    tc: "#283593",
    label: "Computer Lab",
  },
  office: {
    fill: "#f3e5f5",
    edge: "#ce93d8",
    tc: "#6a1b9a",
    label: "Office",
  },
  restroom: {
    fill: "#fce4ec",
    edge: "#f48fb1",
    tc: "#880e4f",
    label: "Restroom",
  },
  utility: {
    fill: "#f5f5f5",
    edge: "#bdbdbd",
    tc: "#424242",
    label: "Utility",
  },
  stair: {
    fill: "#fffde7",
    edge: "#fdd835",
    tc: "#795548",
    label: "Stairs / Lift",
  },
  entrance: {
    fill: "#e3f2fd",
    edge: "#64b5f6",
    tc: "#0d47a1",
    label: "Entrance",
  },
  shop: {
    fill: "#efebe9",
    edge: "#bcaaa4",
    tc: "#4e342e",
    label: "Workshop",
  },
  maker: {
    fill: "#e0f2f1",
    edge: "#80cbc4",
    tc: "#004d40",
    label: "Maker Space",
  },
  corridor: {
    fill: "#eeebe3",
    edge: "#ddd8cd",
    tc: "#888888",
    label: "Corridor",
  },
};

export const ROOMS: Room[] = [
  { id: "1191", name: "Turbine Lab", type: "lab", x: 280, y: 38, w: 380, h: 220 },
  { id: "1150", name: "Mechanical", type: "utility", x: 38, y: 240, w: 200, h: 140 },
  { id: "1152A", name: "1152A", type: "utility", x: 260, y: 298, w: 72, h: 54 },
  { id: "1152B", name: "1152B", type: "utility", x: 332, y: 298, w: 72, h: 54 },
  { id: "1152C", name: "1152C", type: "utility", x: 404, y: 298, w: 72, h: 54 },
  { id: "1152D", name: "1152D", type: "utility", x: 476, y: 298, w: 72, h: 54 },
  { id: "1152E", name: "1152E", type: "utility", x: 548, y: 298, w: 72, h: 54 },
  { id: "1152", name: "1152", type: "utility", x: 450, y: 368, w: 100, h: 58 },
  { id: "1152F", name: "1152F", type: "utility", x: 635, y: 298, w: 88, h: 76 },

  { id: "1151", name: "Bio-Eng Lab BSL2", type: "bio", x: 258, y: 390, w: 200, h: 240 },
  { id: "1153", name: "Tissue Cult BSL2", type: "bio", x: 458, y: 390, w: 172, h: 155 },
  { id: "1143", name: "Research Lab", type: "lab", x: 458, y: 545, w: 172, h: 120 },
  { id: "1142", name: "Bioinstrumentation Lab", type: "lab", x: 630, y: 390, w: 285, h: 275 },

  { id: "1145", name: "Computational Lab", type: "comp", x: 258, y: 660, w: 200, h: 185 },
  { id: "1144", name: "Research Lab", type: "lab", x: 458, y: 660, w: 172, h: 185 },
  { id: "1141", name: "Research Lab", type: "lab", x: 660, y: 660, w: 195, h: 185 },
  { id: "1147", name: "Research Lab", type: "lab", x: 855, y: 660, w: 65, h: 185 },

  { id: "1123", name: "Research Lab", type: "lab", x: 258, y: 885, w: 200, h: 195 },
  { id: "1122", name: "Research Lab", type: "lab", x: 458, y: 885, w: 172, h: 195 },
  { id: "1121", name: "Research Lab", type: "lab", x: 630, y: 825, w: 200, h: 175 },
  { id: "1121A", name: "Dark Room", type: "utility", x: 830, y: 825, w: 95, h: 120 },
  { id: "1120", name: "Mech / Elec", type: "utility", x: 925, y: 825, w: 115, h: 120 },

  { id: "C1194", name: "C1194", type: "corridor", x: 900, y: 38, w: 78, h: 58 },
  { id: "C1193", name: "C1193", type: "corridor", x: 900, y: 96, w: 78, h: 60 },
  { id: "C1192", name: "Stair 1", type: "stair", x: 978, y: 38, w: 122, h: 165 },
  { id: "C1191", name: "Vestibule", type: "entrance", x: 860, y: 38, w: 118, h: 165 },
  { id: "C1180", name: "Elevator", type: "stair", x: 900, y: 268, w: 100, h: 100 },
  { id: "1190", name: "FSAE", type: "utility", x: 860, y: 203, w: 118, h: 82 },

  { id: "1190A", name: "Support", type: "utility", x: 1100, y: 38, w: 160, h: 100 },
  { id: "1489", name: "Support 1489", type: "utility", x: 1260, y: 38, w: 120, h: 100 },
  { id: "C1033", name: "C1033", type: "corridor", x: 1380, y: 38, w: 110, h: 80 },
  { id: "1160", name: "Large Classroom", type: "class", x: 1100, y: 138, w: 390, h: 325 },
  { id: "1180", name: "1180", type: "utility", x: 1000, y: 138, w: 100, h: 80 },

  { id: "1130", name: "Teaching Lab", type: "class", x: 920, y: 463, w: 260, h: 200 },
  { id: "1130B", name: "Staff Office", type: "office", x: 920, y: 523, w: 100, h: 140 },
  { id: "1130C", name: "Lab Prep", type: "utility", x: 1100, y: 423, w: 100, h: 80 },
  { id: "1130D", name: "Lab Prep", type: "utility", x: 1200, y: 423, w: 100, h: 80 },
  { id: "1130E", name: "Lab Storage", type: "utility", x: 1180, y: 503, w: 100, h: 80 },
  { id: "1132", name: "IT", type: "utility", x: 1080, y: 583, w: 80, h: 80 },
  { id: "1134", name: "Janitor", type: "utility", x: 1160, y: 583, w: 80, h: 80 },

  { id: "1133", name: "Med. Classroom", type: "class", x: 920, y: 703, w: 280, h: 215 },
  { id: "1137", name: "Gender Neutral RR", type: "restroom", x: 920, y: 918, w: 145, h: 115 },
  { id: "1136", name: "Women's Restroom", type: "restroom", x: 1065, y: 918, w: 195, h: 115 },

  { id: "1460", name: "Icing Tunnel", type: "lab", x: 1390, y: 683, w: 280, h: 175 },
  { id: "1254", name: "Electrical", type: "utility", x: 1260, y: 858, w: 130, h: 110 },
  { id: "1252", name: "Electrical", type: "utility", x: 1390, y: 858, w: 130, h: 110 },
  { id: "1253", name: "Electrical", type: "utility", x: 1520, y: 858, w: 130, h: 110 },
  { id: "1455", name: "1455", type: "utility", x: 1520, y: 683, w: 130, h: 175 },

  { id: "C1111", name: "Learning Stair", type: "stair", x: 1100, y: 1058, w: 120, h: 120 },
  { id: "1190C", name: "Mechatronics Lab", type: "lab", x: 500, y: 1103, w: 275, h: 160 },
  { id: "1102", name: "Wood Shop", type: "shop", x: 920, y: 1083, w: 280, h: 175 },
  { id: "1200", name: "Maker Space", type: "maker", x: 720, y: 1103, w: 240, h: 160 },
  { id: "1251A", name: "Dark Room", type: "utility", x: 500, y: 1063, w: 120, h: 100 },
  { id: "1251", name: "Research Lab", type: "lab", x: 1100, y: 1178, w: 240, h: 160 },
  { id: "1230", name: "1230", type: "utility", x: 660, y: 1263, w: 180, h: 80 },

  { id: "C1002", name: "Connector (Entrance)", type: "entrance", x: 618, y: 1293, w: 282, h: 82 },
];

export const ROOM_BY_ID: Record<string, Room> = Object.fromEntries(
  ROOMS.map((room) => [room.id, room])
);

export const NODES: Record<string, { x: number; y: number }> = {
  l0: { x: 258, y: 280 },
  l1: { x: 258, y: 390 },
  l2: { x: 258, y: 628 },
  l3: { x: 258, y: 870 },
  l4: { x: 258, y: 1080 },

  c0: { x: 630, y: 38 },
  c1: { x: 630, y: 360 },
  c2: { x: 630, y: 628 },
  c3: { x: 630, y: 870 },
  c4: { x: 630, y: 1080 },
  c5: { x: 630, y: 1270 },
  c6: { x: 759, y: 1334 },

  r0: { x: 950, y: 38 },
  r1: { x: 950, y: 203 },
  r2: { x: 950, y: 463 },
  r3: { x: 950, y: 628 },
  r4: { x: 950, y: 870 },
  r5: { x: 950, y: 1058 },

  h1a: { x: 459, y: 628 },
  h2a: { x: 459, y: 870 },

  tc: { x: 630, y: 280 },

  rw1: { x: 1240, y: 463 },
  rw2: { x: 1390, y: 628 },
  rw3: { x: 1390, y: 870 },
  rw4: { x: 1260, y: 870 },

  ll: { x: 500, y: 1080 },
  lm: { x: 720, y: 1200 },
};

export const EDGES: [string, string][] = [
  ["l0", "l1"],
  ["l1", "l2"],
  ["l2", "l3"],
  ["l3", "l4"],

  ["c0", "c1"],
  ["c1", "c2"],
  ["c2", "c3"],
  ["c3", "c4"],
  ["c4", "c5"],
  ["c5", "c6"],

  ["r0", "r1"],
  ["r1", "r2"],
  ["r2", "r3"],
  ["r3", "r4"],
  ["r4", "r5"],

  ["l0", "tc"],
  ["tc", "c1"],
  ["tc", "r0"],

  ["l2", "h1a"],
  ["h1a", "c2"],
  ["c2", "r3"],

  ["l3", "h2a"],
  ["h2a", "c3"],
  ["c3", "r4"],

  ["ll", "c4"],
  ["c4", "r5"],

  ["c5", "lm"],
  ["lm", "c6"],

  ["r2", "rw1"],

  ["r3", "rw2"],
  ["rw2", "rw3"],
  ["rw3", "rw4"],
  ["rw4", "r4"],

  ["l4", "ll"],
];

export const DOOR: Record<string, string> = {
  "1191": "c1",
  "1150": "l2",
  "1152A": "l0",
  "1152B": "l0",
  "1152C": "tc",
  "1152D": "tc",
  "1152E": "tc",
  "1152": "c1",
  "1152F": "c1",
  "1151": "l2",
  "1153": "c2",
  "1143": "c2",
  "1142": "c2",
  "1145": "l3",
  "1144": "c3",
  "1141": "c3",
  "1147": "r4",
  "1123": "l3",
  "1122": "c3",
  "1121": "c3",
  "1121A": "r4",
  "1120": "r4",
  "C1194": "r0",
  "C1193": "r0",
  "C1192": "r0",
  "C1191": "r0",
  "C1180": "r1",
  "1190": "r1",
  "1190A": "r0",
  "1489": "r0",
  "C1033": "r0",
  "1160": "rw1",
  "1180": "r2",
  "1130": "r2",
  "1130B": "r2",
  "1130C": "rw1",
  "1130D": "rw1",
  "1130E": "rw1",
  "1132": "rw1",
  "1134": "rw1",
  "1133": "r4",
  "1137": "r4",
  "1136": "r4",
  "1460": "rw2",
  "1254": "rw3",
  "1252": "rw3",
  "1253": "rw3",
  "1455": "rw2",
  "C1111": "r5",
  "1190C": "ll",
  "1102": "r5",
  "1200": "c4",
  "1251A": "ll",
  "1251": "r5",
  "1230": "c5",
  "C1002": "c6",
};

export const roomCenter = (roomId: string) => {
  const room = ROOM_BY_ID[roomId];
  return { x: room.x + room.w / 2, y: room.y + room.h / 2 };
};