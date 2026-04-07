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

export const MAP_W = 2600;
export const MAP_H = 2100;
export const MPU = 0.054;
//used for determining room color depending on if dark mode is enabled
export const getRoomStyles = (darkMode: boolean) => {
  return darkMode ? TYPESDark : TYPESLight;
};
//Color data for each room type in the light mode
export const TYPESLight: Record<
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
export const TYPESDark: Record<
  RoomType,
  { fill: string; edge: string; tc: string; label: string }
//Starting The Dark Mode room color data

> = {
  lab: {
    fill: "#93bdf186",
    edge: "#4a98d886",
    tc: "#ffffff",
    label: "Research / Lab",
  },
  bio: {
    fill: "#a2f1a971",
    edge: "#4dc5537e",
    tc: "#ffffff",
    label: "Bio Lab (BSL2)",
  },
  class: {
    fill: "#fccd827c",
    edge: "#fa980579",
    tc: "#ffffff",
    label: "Classroom",
  },
  comp: {
    fill: "#8595f081",
    edge: "#445bdb79",
    tc: "#ffffff",
    label: "Computer Lab",
  },
  office: {
    fill: "#df80ee73",
    edge: "#bf3bd669",
    tc: "#ffffff",
    label: "Office",
  },
  restroom: {
    fill: "#f887ad75",
    edge: "#fc38796c",
    tc: "#ffffff",
    label: "Restroom",
  },
  utility: {
    fill: "#f58a8a6c",
    edge: "#b640406c",
    tc: "#ffffff",
    label: "Utility",
  },
  stair: {
    fill: "#faf08269",
    edge: "#fccf0a71",
    tc: "#ffffff",
    label: "Stairs / Lift",
  },
  entrance: {
    fill: "#86cbfc6b",
    edge: "#1696ff73",
    tc: "#ffffff",
    label: "Entrance",
  },
  shop: {
    fill: "#e9a7856c",
    edge: "#b3513169",
    tc: "#ffffff",
    label: "Workshop",
  },
  maker: {
    fill: "#8aeee962",
    edge: "#37c9ba6c",
    tc: "#ffffff",
    label: "Maker Space",
  },
  corridor: {
    fill: "#eed1836e",
    edge: "#d6a3356b",
    tc: "#ffffff",
    label: "Corridor",
  },
};


export const ROOMS: Room[] = [
  { id: "1191", name: "Turbine Lab", type: "lab", x: 280, y: 38, w: 350, h: 220 },
  { id: "1150", name: "Mechanical", type: "utility", x: 38, y: 240, w: 200, h: 140 },
  { id: "1152A", name: "1152A", type: "utility", x: 260, y: 298, w: 72, h: 54 },
  { id: "1152B", name: "1152B", type: "utility", x: 332, y: 298, w: 72, h: 54 },
  { id: "1152C", name: "1152C", type: "utility", x: 404, y: 298, w: 72, h: 54 },
  { id: "1152D", name: "1152D", type: "utility", x: 476, y: 298, w: 72, h: 54 },
  { id: "1152E", name: "1152E", type: "utility", x: 548, y: 298, w: 72, h: 54 },
  { id: "1152F", name: "1152F", type: "utility", x: 635, y: 298, w: 88, h: 76 },

  { id: "1151", name: "Bio-Eng Lab BSL2", type: "bio", x: 258, y: 390, w: 200, h: 240 },
  { id: "1153", name: "Tissue Cult BSL2", type: "bio", x: 458, y: 390, w: 172, h: 155 },
  { id: "1143", name: "Research Lab", type: "lab", x: 458, y: 545, w: 172, h: 115 },
  { id: "1142", name: "Bioinstrumentation Lab", type: "lab", x: 630, y: 390, w: 285, h: 270 },

  { id: "1145", name: "Computational Lab", type: "comp", x: 258, y: 660, w: 200, h: 185 },
  { id: "1144", name: "Research Lab", type: "lab", x: 458, y: 660, w: 172, h: 185 },
  { id: "1141", name: "Research Lab", type: "lab", x: 660, y: 660, w: 195, h: 165 },
  { id: "1147", name: "Research Lab", type: "lab", x: 855, y: 660, w: 65, h: 165 },

  { id: "1123", name: "Research Lab", type: "lab", x: 258, y: 885, w: 200, h: 195 },
  { id: "1122", name: "Research Lab", type: "lab", x: 458, y: 885, w: 172, h: 170 },
  { id: "1121", name: "Research Lab", type: "lab", x: 630, y: 825, w: 200, h: 175 },
  { id: "1121A", name: "Dark Room", type: "utility", x: 830, y: 825, w: 90, h: 120 },
  { id: "1120", name: "Mech / Elec", type: "utility", x: 830, y: 945, w: 90, h: 110 },

  { id: "C1192", name: "Stair 1", type: "stair", x: 978, y: 38, w: 122, h: 165 },
  { id: "C1191", name: "Vestibule", type: "entrance", x: 860, y: 38, w: 118, h: 165 },
  { id: "C1180", name: "Elevator", type: "stair", x: 900, y: 268, w: 100, h: 100 },
  { id: "1190", name: "FSAE", type: "utility", x: 860, y: 203, w: 118, h: 65 },

  { id: "1190A", name: "Support", type: "utility", x: 1100, y: 38, w: 160, h: 100 },
  { id: "1489", name: "Support 1489", type: "utility", x: 1260, y: 38, w: 120, h: 100 },
  { id: "C1033", name: "C1033", type: "corridor", x: 1380, y: 38, w: 110, h: 80 },
  { id: "1160", name: "Large Classroom", type: "class", x: 1100, y: 138, w: 390, h: 285 },
  { id: "1180", name: "1180", type: "utility", x: 1000, y: 203, w: 100, h: 80 },

  { id: "1130B", name: "Staff Office", type: "office", x: 920, y: 463, w: 100, h: 200 },
  { id: "1130", name: "Teaching Lab", type: "class", x: 1020, y: 463, w: 160, h: 200 },
  { id: "1130C", name: "Lab Prep", type: "utility", x: 1180, y: 463, w: 100, h: 80 },
  { id: "1130D", name: "Lab Prep", type: "utility", x: 1280, y: 463, w: 100, h: 80 },
  { id: "1130E", name: "Lab Storage", type: "utility", x: 1180, y: 543, w: 100, h: 80 },
  { id: "1132", name: "IT", type: "utility", x: 1180, y: 623, w: 80, h: 80 },
  { id: "1134", name: "Janitor", type: "utility", x: 1260, y: 623, w: 80, h: 80 },

  { id: "1133", name: "Med. Classroom", type: "class", x: 920, y: 703, w: 280, h: 215 },
  { id: "1137", name: "Gender Neutral RR", type: "restroom", x: 920, y: 918, w: 145, h: 115 },
  { id: "1136", name: "Women's Restroom", type: "restroom", x: 1065, y: 918, w: 195, h: 115 },

  { id: "1460", name: "Icing Tunnel", type: "lab", x: 1390, y: 683, w: 130, h: 175 },
  { id: "1455", name: "1455", type: "utility", x: 1520, y: 683, w: 130, h: 175 },
  { id: "1254", name: "Electrical", type: "utility", x: 1260, y: 858, w: 130, h: 110 },
  { id: "1252", name: "Electrical", type: "utility", x: 1390, y: 858, w: 130, h: 110 },
  { id: "1253", name: "Electrical", type: "utility", x: 1520, y: 858, w: 130, h: 110 },

  { id: "C1111", name: "Learning Stair", type: "stair", x: 1200, y: 1058, w: 120, h: 120 },
  { id: "1251A", name: "Dark Room", type: "utility", x: 500, y: 1058, w: 120, h: 45 },
  { id: "1190C", name: "Mechatronics Lab", type: "lab", x: 500, y: 1103, w: 220, h: 160 },
  { id: "1200", name: "Maker Space", type: "maker", x: 720, y: 1103, w: 200, h: 160 },
  { id: "1102", name: "Wood Shop", type: "shop", x: 920, y: 1083, w: 280, h: 175 },
  { id: "1251", name: "Research Lab", type: "lab", x: 1200, y: 1178, w: 240, h: 160 },
  { id: "1230", name: "1230", type: "utility", x: 400, y: 1263, w: 180, h: 80 },
  { id: "C1002", name: "Connector (Entrance)", type: "entrance", x: 618, y: 1293, w: 282, h: 82 },

  { id: "1009E", name: "Staircase 1009E", type: "stair", x: 1700, y: 38, w: 100, h: 110 },
  { id: "1068", name: "1068", type: "lab", x: 1800, y: 38, w: 130, h: 110 },
  { id: "1067", name: "1067", type: "lab", x: 1930, y: 38, w: 130, h: 110 },
  { id: "1065", name: "1065", type: "lab", x: 2060, y: 38, w: 150, h: 110 },
  { id: "1062", name: "1062", type: "lab", x: 2210, y: 38, w: 150, h: 110 },

  { id: "1055", name: "1055", type: "utility", x: 1800, y: 148, w: 130, h: 130 },
  { id: "1056", name: "1056", type: "utility", x: 1930, y: 148, w: 130, h: 130 },
  { id: "1060", name: "1060", type: "class", x: 2060, y: 148, w: 150, h: 130 },
  { id: "1061", name: "1061", type: "class", x: 2210, y: 148, w: 150, h: 130 },

  { id: "1013", name: "1013", type: "office", x: 1700, y: 278, w: 130, h: 130 },
  { id: "1012", name: "1012", type: "office", x: 1830, y: 278, w: 130, h: 130 },
  { id: "1002", name: "Computer Lab 1002", type: "comp", x: 1960, y: 278, w: 170, h: 130 },
  { id: "1050", name: "1050", type: "lab", x: 2130, y: 278, w: 120, h: 130 },
  { id: "1049", name: "1049", type: "lab", x: 2250, y: 278, w: 120, h: 130 },
  { id: "1047", name: "Computer Lab 1047", type: "comp", x: 2370, y: 278, w: 130, h: 250 },

  { id: "1017", name: "1017", type: "class", x: 1700, y: 408, w: 130, h: 120 },
  { id: "1018", name: "1018", type: "class", x: 1830, y: 408, w: 130, h: 120 },
  { id: "1021", name: "1021", type: "class", x: 1960, y: 408, w: 170, h: 120 },
  { id: "1051", name: "1051", type: "lab", x: 2130, y: 408, w: 120, h: 120 },
  { id: "1045", name: "1045", type: "lab", x: 2250, y: 408, w: 120, h: 120 },

  { id: "1014", name: "1014", type: "office", x: 1700, y: 528, w: 85, h: 90 },
  { id: "1015", name: "1015", type: "office", x: 1785, y: 528, w: 85, h: 90 },
  { id: "1016", name: "1016", type: "office", x: 1870, y: 528, w: 90, h: 90 },

  { id: "1022", name: "1022", type: "class", x: 1700, y: 668, w: 130, h: 120 },
  { id: "1023", name: "1023", type: "class", x: 1830, y: 668, w: 130, h: 120 },
  { id: "1024", name: "1024", type: "class", x: 1960, y: 668, w: 130, h: 120 },
  { id: "1037", name: "1037", type: "lab", x: 2090, y: 668, w: 130, h: 120 },
  { id: "1039", name: "Computer Lab 1039", type: "comp", x: 2220, y: 668, w: 150, h: 120 },
  { id: "1042", name: "1042", type: "lab", x: 2370, y: 668, w: 130, h: 120 },

  { id: "1026", name: "1026", type: "class", x: 1700, y: 788, w: 130, h: 120 },
  { id: "1032", name: "1032", type: "lab", x: 1830, y: 788, w: 130, h: 120 },
  { id: "1036", name: "1036", type: "lab", x: 1960, y: 788, w: 120, h: 120 },
  { id: "1035", name: "1035", type: "lab", x: 2080, y: 788, w: 120, h: 120 },
  { id: "1034", name: "1034", type: "lab", x: 2200, y: 788, w: 120, h: 120 },
  { id: "1033", name: "1033", type: "lab", x: 2320, y: 788, w: 120, h: 120 },

  { id: "1100", name: "1100", type: "office", x: 1700, y: 908, w: 130, h: 100 },
  { id: "1101A", name: "1101A", type: "office", x: 1830, y: 908, w: 130, h: 100 },

  { id: "1225", name: "CET Multi-Purpose Room", type: "class", x: 38, y: 1400, w: 200, h: 200 },
  { id: "1215", name: "CET Survey & Test Lab", type: "lab", x: 238, y: 1400, w: 200, h: 200 },
  { id: "1459", name: "IDF Room", type: "utility", x: 438, y: 1400, w: 160, h: 200 },
  { id: "1290", name: "CET Materials Test Lab", type: "lab", x: 598, y: 1400, w: 430, h: 200 },
  { id: "1410", name: "MET Materials Testing", type: "lab", x: 1028, y: 1400, w: 380, h: 200 },
  { id: "1500", name: "Capstone Lab", type: "lab", x: 1408, y: 1400, w: 290, h: 200 },
  { id: "1601", name: "Conf. Room 1601", type: "office", x: 1698, y: 1400, w: 180, h: 130 },
  { id: "1603", name: "Conf. Room 1603", type: "office", x: 1698, y: 1530, w: 180, h: 130 },
  { id: "1600A", name: "Waiting Area", type: "utility", x: 1878, y: 1400, w: 100, h: 130 },
  { id: "1625", name: "Chair Office", type: "office", x: 1878, y: 1530, w: 100, h: 130 },

  { id: "1300", name: "ET Computer Lab", type: "comp", x: 38, y: 1600, w: 200, h: 200 },
  { id: "1302", name: "ET Computer Lab", type: "comp", x: 238, y: 1600, w: 200, h: 200 },
  { id: "1360", name: "ET Computer Lab", type: "comp", x: 438, y: 1600, w: 200, h: 200 },
  { id: "1365", name: "Lab Service", type: "utility", x: 638, y: 1600, w: 200, h: 200 },
  { id: "1430", name: "MET Fluid & Thermal", type: "lab", x: 838, y: 1600, w: 570, h: 200 },
  { id: "1540", name: "MET Drafting Lab", type: "lab", x: 1408, y: 1600, w: 290, h: 200 },

  { id: "1602", name: "F.O. 1602", type: "office", x: 1698, y: 1660, w: 90, h: 80 },
  { id: "1604", name: "F.O. 1604", type: "office", x: 1698, y: 1740, w: 90, h: 80 },
  { id: "1606", name: "F.O. 1606", type: "office", x: 1698, y: 1820, w: 90, h: 80 },
  { id: "1608", name: "F.O. 1608", type: "office", x: 1698, y: 1900, w: 90, h: 80 },
  { id: "1614", name: "Records 1614", type: "office", x: 1698, y: 1980, w: 90, h: 80 },
  { id: "1607", name: "P.D. 1607", type: "office", x: 1788, y: 1660, w: 90, h: 80 },
  { id: "1609", name: "P.D. 1609", type: "office", x: 1788, y: 1740, w: 90, h: 80 },
  { id: "1611", name: "P.D. 1611", type: "office", x: 1788, y: 1820, w: 90, h: 80 },
  { id: "1613", name: "P.D. 1613", type: "office", x: 1788, y: 1900, w: 90, h: 80 },
  { id: "1615", name: "P.D. 1615", type: "office", x: 1788, y: 1980, w: 90, h: 80 },

  { id: "1342", name: "Student Lounge", type: "utility", x: 38, y: 1800, w: 200, h: 160 },
  { id: "1382", name: "Hardware Staging", type: "utility", x: 238, y: 1800, w: 200, h: 160 },
  { id: "1392", name: "Computer Repair", type: "utility", x: 438, y: 1800, w: 200, h: 160 },
  { id: "1381", name: "Women's Restroom", type: "restroom", x: 638, y: 1800, w: 100, h: 160 },
  { id: "1391", name: "Men's Restroom", type: "restroom", x: 738, y: 1800, w: 100, h: 160 },
];

export const ROOM_BY_ID: Record<string, Room> = Object.fromEntries(
  ROOMS.map((room) => [room.id, room])
);

export const NODES: Record<string, { x: number; y: number }> = {
  // left hallway spine
  l0: { x: 258, y: 258 },
  l1: { x: 258, y: 390 },
  l2: { x: 258, y: 845 },
  l3: { x: 258, y: 1080 },

  // center hallway spine
  c0: { x: 630, y: 258 },
  c1: { x: 630, y: 390 },
  c2: { x: 630, y: 845 },
  c3: { x: 630, y: 1080 },
  c4: { x: 630, y: 1270 },
  c5: { x: 759, y: 1334 },

  // right-center hallway spine
  // moved left so routes stay in the hallway beside 1130B / 1133 / restrooms
  r0: { x: 905, y: 280 },
  r1: { x: 905, y: 458 },
  r2: { x: 905, y: 845 },
  r3: { x: 905, y: 1040 },
  r4: { x: 905, y: 1058 },

  // hallway connectors
  h_top_mid: { x: 459, y: 258 },
  h_mid: { x: 459, y: 845 },
  h_low: { x: 720, y: 1080 },
  h_entry: { x: 720, y: 1265 },

  // teaching lab spur
  teach: { x: 1240, y: 463 },

  // right-side bridge corridor
  br0: { x: 1260, y: 845 },
  br1: { x: 1390, y: 845 },
  br2: { x: 1390, y: 628 },

  // upper wing
  uw0: { x: 1700, y: 628 },
  uw1: { x: 1700, y: 302 },
  uw2: { x: 1700, y: 168 },
  uw3: { x: 2365, y: 168 },
  uw4: { x: 2250, y: 408 },
  uw5: { x: 2250, y: 628 },
  uw6: { x: 2445, y: 848 },
  uw7: { x: 1700, y: 848 },

  // ET section
  et0: { x: 759, y: 1382 },
  et1: { x: 160, y: 1382 },
  et2: { x: 815, y: 1382 },
  et3: { x: 1220, y: 1382 },
  etL0: { x: 20, y: 1382 },
  etL1: { x: 20, y: 1700 },
  etR0: { x: 2010, y: 1382 },
  etR1: { x: 2010, y: 1760 },
};

export const EDGES: [string, string][] = [
  // left spine
  ["l0", "l1"],
  ["l1", "l2"],
  ["l2", "l3"],

  // center spine
  ["c0", "c1"],
  ["c1", "c2"],
  ["c2", "c3"],
  ["c3", "c4"],
  ["c4", "c5"],

  // right-center spine
  ["r0", "r1"],
  ["r1", "r2"],
  ["r2", "r3"],
  ["r3", "r4"],

  // upper hallway
  ["l0", "h_top_mid"],
  ["h_top_mid", "c0"],
  ["c0", "r0"],

  // middle hallway
  ["l2", "h_mid"],
  ["h_mid", "c2"],
  ["c2", "r2"],

  // lower hall by 1190C / maker / entrance
  ["l3", "c3"],
  ["c3", "h_low"],
  ["h_low", "r4"],
  ["h_low", "h_entry"],
  ["h_entry", "c4"],
  ["h_entry", "c5"],

  // teaching lab area
  ["r1", "teach"],

  // right-side bridge corridor
  ["r2", "br0"],
  ["br0", "br1"],
  ["br1", "br2"],
  ["br2", "uw0"],

  // upper wing orthogonal ring
  ["uw0", "uw1"],
  ["uw1", "uw2"],
  ["uw2", "uw3"],
  ["uw3", "uw4"],
  ["uw4", "uw5"],
  ["uw0", "uw5"],
  ["uw5", "uw6"],
  ["uw6", "uw7"],
  ["uw7", "uw0"],
  ["uw1", "uw4"],

  // ET section
  ["c5", "et0"],
  ["et0", "et1"],
  ["et0", "et2"],
  ["et0", "et3"],
  ["et1", "et2"],
  ["et2", "et3"],
  ["et1", "etL0"],
  ["etL0", "etL1"],
  ["et3", "etR0"],
  ["etR0", "etR1"],
];

export const DOOR: Record<string, string> = {
  "1191": "c0",
  "1150": "l0",
  "1152A": "l0",
  "1152B": "l0",
  "1152C": "h_top_mid",
  "1152D": "h_top_mid",
  "1152E": "h_top_mid",
  "1152F": "c0",

  "1151": "l1",
  "1153": "c1",
  "1143": "c1",
  "1142": "c1",

  "1145": "l2",
  "1144": "h_mid",
  "1141": "c2",
  "1147": "r2",

  "1123": "l2",
  "1122": "h_mid",
  "1121": "c2",
  "1121A": "r2",
  "1120": "r3",

  "C1192": "r0",
  "C1191": "r0",
  "C1180": "r0",
  "1190": "r0",
  "1190A": "r0",
  "1489": "r0",
  "C1033": "r0",
  "1160": "r0",
  "1180": "r0",

  "1130B": "r1",
  "1130": "r1",
  "1130C": "teach",
  "1130D": "teach",
  "1130E": "teach",
  "1132": "teach",
  "1134": "teach",

  "1133": "r2",
  "1137": "r3",
  "1136": "r3",

  "1460": "br2",
  "1455": "br2",
  "1254": "br0",
  "1252": "br1",
  "1253": "br1",

  "C1111": "r4",
  "1251A": "c3",
  "1190C": "h_low",
  "1200": "h_low",
  "1102": "r4",
  "1251": "r4",
  "1230": "c4",
  "C1002": "c5",

  "1009E": "uw2",
  "1068": "uw2",
  "1067": "uw2",
  "1065": "uw3",
  "1062": "uw3",
  "1055": "uw2",
  "1056": "uw2",
  "1060": "uw3",
  "1061": "uw3",

  "1013": "uw1",
  "1012": "uw1",
  "1002": "uw1",
  "1050": "uw4",
  "1049": "uw4",
  "1047": "uw4",
  "1017": "uw1",
  "1018": "uw1",
  "1021": "uw1",
  "1051": "uw4",
  "1045": "uw4",
  "1014": "uw1",
  "1015": "uw1",
  "1016": "uw1",

  "1022": "uw0",
  "1023": "uw0",
  "1024": "uw0",
  "1037": "uw5",
  "1039": "uw5",
  "1042": "uw5",
  "1026": "uw7",
  "1032": "uw7",
  "1036": "uw6",
  "1035": "uw6",
  "1034": "uw6",
  "1033": "uw6",
  "1100": "uw7",
  "1101A": "uw7",

  "1225": "et1",
  "1215": "et1",
  "1459": "et1",
  "1290": "et2",
  "1410": "et3",
  "1500": "et3",

  "1300": "etL1",
  "1302": "et1",
  "1360": "et2",
  "1365": "et2",
  "1430": "et2",
  "1540": "et3",
  "1342": "etL1",
  "1382": "et1",
  "1392": "et2",
  "1381": "et2",
  "1391": "et2",

  "1601": "etR0",
  "1603": "etR0",
  "1600A": "etR0",
  "1625": "etR0",
  "1602": "etR1",
  "1604": "etR1",
  "1606": "etR1",
  "1608": "etR1",
  "1614": "etR1",
  "1607": "etR1",
  "1609": "etR1",
  "1611": "etR1",
  "1613": "etR1",
  "1615": "etR1",
};

export const roomCenter = (roomId: string) => {
  const room = ROOM_BY_ID[roomId];
  return { x: room.x + room.w / 2, y: room.y + room.h / 2 };
};
