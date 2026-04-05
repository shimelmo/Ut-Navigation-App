import {
  F2_DOOR,
  F2_EDGES,
  F2_NODES,
  ROOM2_BY_ID,
  ROOMS_FLOOR_2,
} from "@/data/floor2MapData";
import {
  DOOR,
  EDGES,
  MPU,
  NODES,
  ROOM_BY_ID,
  ROOMS,
} from "@/data/floorMapData";

type Point = { x: number; y: number };

type RoomShape = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type RouteStep = {
  text: string;
  distanceMeters: number;
};

type RouteSummary = {
  from: string;
  to: string;
  straightLineDistanceMeters: number;
  totalDistanceMeters: number;
  steps: RouteStep[];
};

type FloorNumber = 1 | 2;

const ROOM_EXIT_PADDING = 10;
const COLLISION_PADDING = 6;

const distance = (a: Point, b: Point) => {
  return Math.hypot(b.x - a.x, b.y - a.y);
};

const pixelsToMeters = (pixels: number) => {
  return Math.round(pixels * MPU);
};

const buildGraph = (
  nodes: Record<string, Point>,
  edges: [string, string][]
) => {
  const graph: Record<string, { node: string; dist: number }[]> = {};

  Object.keys(nodes).forEach((node) => {
    graph[node] = [];
  });

  edges.forEach(([a, b]) => {
    const d = distance(nodes[a], nodes[b]);
    graph[a].push({ node: b, dist: d });
    graph[b].push({ node: a, dist: d });
  });

  return graph;
};

const GRAPH_F1 = buildGraph(NODES, EDGES);
const GRAPH_F2 = buildGraph(F2_NODES, F2_EDGES);

const astarOnGraph = (
  startNode: string,
  goalNode: string,
  nodes: Record<string, Point>,
  graph: Record<string, { node: string; dist: number }[]>
) => {
  if (startNode === goalNode) return [startNode];

  const heuristic = (node: string) => distance(nodes[node], nodes[goalNode]);

  const openQueue: {
    f: number;
    g: number;
    node: string;
    path: string[];
  }[] = [
    {
      f: heuristic(startNode),
      g: 0,
      node: startNode,
      path: [startNode],
    },
  ];

  const visited = new Set<string>();

  while (openQueue.length > 0) {
    openQueue.sort((a, b) => a.f - b.f);
    const current = openQueue.shift();

    if (!current) return null;
    if (visited.has(current.node)) continue;

    visited.add(current.node);

    if (current.node === goalNode) {
      return current.path;
    }

    for (const next of graph[current.node] || []) {
      if (!visited.has(next.node)) {
        const newG = current.g + next.dist;
        openQueue.push({
          f: newG + heuristic(next.node),
          g: newG,
          node: next.node,
          path: [...current.path, next.node],
        });
      }
    }
  }

  return null;
};

const getRoomByFloor = (
  roomId: string,
  floor: FloorNumber
): RoomShape | null => {
  if (floor === 1) {
    return ROOM_BY_ID[roomId] || null;
  }

  return ROOM2_BY_ID[roomId] || null;
};

const getRoomsByFloor = (floor: FloorNumber): RoomShape[] => {
  return floor === 1 ? ROOMS : ROOMS_FLOOR_2;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

/*
  Use a doorway-like point on the room edge instead of the room center.
  This makes the blue route leave and enter from the hallway side of the room.
*/
const roomEdgePointTowardNode = (
  room: RoomShape,
  hallwayNode: Point
): Point => {
  const centerX = room.x + room.w / 2;
  const centerY = room.y + room.h / 2;

  const dx = hallwayNode.x - centerX;
  const dy = hallwayNode.y - centerY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx >= 0) {
      return {
        x: room.x + room.w - ROOM_EXIT_PADDING,
        y: clamp(
          hallwayNode.y,
          room.y + ROOM_EXIT_PADDING,
          room.y + room.h - ROOM_EXIT_PADDING
        ),
      };
    }

    return {
      x: room.x + ROOM_EXIT_PADDING,
      y: clamp(
        hallwayNode.y,
        room.y + ROOM_EXIT_PADDING,
        room.y + room.h - ROOM_EXIT_PADDING
      ),
    };
  }

  if (dy >= 0) {
    return {
      x: clamp(
        hallwayNode.x,
        room.x + ROOM_EXIT_PADDING,
        room.x + room.w - ROOM_EXIT_PADDING
      ),
      y: room.y + room.h - ROOM_EXIT_PADDING,
    };
  }

  return {
    x: clamp(
      hallwayNode.x,
      room.x + ROOM_EXIT_PADDING,
      room.x + room.w - ROOM_EXIT_PADDING
    ),
    y: room.y + ROOM_EXIT_PADDING,
  };
};

const pointKey = (point: Point) => `${Math.round(point.x)}:${Math.round(point.y)}`;

const isCollinear = (a: Point, b: Point, c: Point) => {
  return (a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y);
};

const simplifyRoutePoints = (points: Point[]) => {
  if (points.length <= 2) return points;

  const result: Point[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const current = points[i];
    const next = points[i + 1];

    if (pointKey(prev) === pointKey(current)) continue;
    if (isCollinear(prev, current, next)) continue;

    result.push(current);
  }

  const last = points[points.length - 1];
  if (pointKey(result[result.length - 1]) !== pointKey(last)) {
    result.push(last);
  }

  return result;
};

const segmentHitsRoom = (
  a: Point,
  b: Point,
  room: RoomShape
) => {
  const left = room.x - COLLISION_PADDING;
  const right = room.x + room.w + COLLISION_PADDING;
  const top = room.y - COLLISION_PADDING;
  const bottom = room.y + room.h + COLLISION_PADDING;

  // only check axis-aligned segments here
  if (a.x === b.x) {
    const x = a.x;
    const segTop = Math.min(a.y, b.y);
    const segBottom = Math.max(a.y, b.y);

    return x > left && x < right && segBottom > top && segTop < bottom;
  }

  if (a.y === b.y) {
    const y = a.y;
    const segLeft = Math.min(a.x, b.x);
    const segRight = Math.max(a.x, b.x);

    return y > top && y < bottom && segRight > left && segLeft < right;
  }

  return false;
};

const segmentHitsAnyRoom = (
  a: Point,
  b: Point,
  rooms: RoomShape[]
) => {
  return rooms.some((room) => segmentHitsRoom(a, b, room));
};

const collisionCountForBentPath = (
  a: Point,
  bend: Point,
  b: Point,
  rooms: RoomShape[]
) => {
  return rooms.reduce((count, room) => {
    return (
      count +
      (segmentHitsRoom(a, bend, room) ? 1 : 0) +
      (segmentHitsRoom(bend, b, room) ? 1 : 0)
    );
  }, 0);
};

const chooseOrthogonalBend = (
  a: Point,
  b: Point,
  rooms: RoomShape[]
): Point | null => {
  if (a.x === b.x || a.y === b.y) return null;

  const bend1 = { x: a.x, y: b.y };
  const bend2 = { x: b.x, y: a.y };

  const bend1Clear =
    !segmentHitsAnyRoom(a, bend1, rooms) && !segmentHitsAnyRoom(bend1, b, rooms);

  const bend2Clear =
    !segmentHitsAnyRoom(a, bend2, rooms) && !segmentHitsAnyRoom(bend2, b, rooms);

  if (bend1Clear && !bend2Clear) return bend1;
  if (bend2Clear && !bend1Clear) return bend2;

  if (bend1Clear && bend2Clear) {
    // Prefer horizontal-first when distances tie. It usually looks closer
    // to hallway routing on these floor plans.
    return bend2;
  }

  const bend1Collisions = collisionCountForBentPath(a, bend1, b, rooms);
  const bend2Collisions = collisionCountForBentPath(a, bend2, b, rooms);

  return bend1Collisions <= bend2Collisions ? bend1 : bend2;
};

const orthogonalizeRoute = (
  rawPoints: Point[],
  floor: FloorNumber
) => {
  if (rawPoints.length <= 2) return rawPoints;

  const rooms = getRoomsByFloor(floor);
  const expanded: Point[] = [rawPoints[0]];

  for (let i = 0; i < rawPoints.length - 1; i++) {
    const current = rawPoints[i];
    const next = rawPoints[i + 1];

    const bend = chooseOrthogonalBend(current, next, rooms);

    if (bend) {
      if (pointKey(expanded[expanded.length - 1]) !== pointKey(bend)) {
        expanded.push(bend);
      }
    }

    if (pointKey(expanded[expanded.length - 1]) !== pointKey(next)) {
      expanded.push(next);
    }
  }

  return simplifyRoutePoints(expanded);
};

export const findRoute = (
  startRoomId: string,
  endRoomId: string,
  floor: FloorNumber = 1
) => {
  const nodes = floor === 1 ? NODES : F2_NODES;
  const doors = floor === 1 ? DOOR : F2_DOOR;
  const graph = floor === 1 ? GRAPH_F1 : GRAPH_F2;

  const startDoor = doors[startRoomId];
  const endDoor = doors[endRoomId];

  if (!startDoor || !endDoor) return null;

  const startRoom = getRoomByFloor(startRoomId, floor);
  const endRoom = getRoomByFloor(endRoomId, floor);

  if (!startRoom || !endRoom) return null;

  const startDoorNode = nodes[startDoor];
  const endDoorNode = nodes[endDoor];

  const startPoint = roomEdgePointTowardNode(startRoom, startDoorNode);
  const endPoint = roomEdgePointTowardNode(endRoom, endDoorNode);

  let rawRoute: Point[] | null = null;

  if (startDoor === endDoor) {
    rawRoute = [startPoint, startDoorNode, endPoint];
  } else {
    const nodePath = astarOnGraph(startDoor, endDoor, nodes, graph);
    if (!nodePath) return null;
    rawRoute = [startPoint, ...nodePath.map((node) => nodes[node]), endPoint];
  }

  return orthogonalizeRoute(rawRoute, floor);
};

const getCompassDirection = (dx: number, dy: number) => {
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (angle >= -22.5 && angle < 22.5) return "East";
  if (angle >= 22.5 && angle < 67.5) return "Southeast";
  if (angle >= 67.5 && angle < 112.5) return "South";
  if (angle >= 112.5 && angle < 157.5) return "Southwest";
  if (angle >= 157.5 || angle < -157.5) return "West";
  if (angle >= -157.5 && angle < -112.5) return "Northwest";
  if (angle >= -112.5 && angle < -67.5) return "North";
  return "Northeast";
};

const getTurnInstruction = (prev: Point, current: Point, next: Point) => {
  const v1x = current.x - prev.x;
  const v1y = current.y - prev.y;
  const v2x = next.x - current.x;
  const v2y = next.y - current.y;

  const cross = v1x * v2y - v1y * v2x;
  const dot = v1x * v2x + v1y * v2y;

  if (Math.abs(cross) < 0.001 && dot > 0) {
    return "Continue straight";
  }

  if (cross > 0) {
    return "Turn right";
  }

  if (cross < 0) {
    return "Turn left";
  }

  return "Continue";
};

const getDirectionBucket = (a: Point, b: Point) => {
  return getCompassDirection(b.x - a.x, b.y - a.y);
};

const pushMergedStep = (
  steps: RouteStep[],
  text: string,
  distanceMeters: number
) => {
  if (distanceMeters <= 0) return;

  const lastStep = steps[steps.length - 1];

  if (!lastStep) {
    steps.push({ text, distanceMeters });
    return;
  }

  if (
    lastStep.text === text ||
    (lastStep.text === "Continue straight" && text === "Continue straight")
  ) {
    lastStep.distanceMeters += distanceMeters;
    return;
  }

  steps.push({ text, distanceMeters });
};

export const buildRouteSummary = (
  routePoints: Point[],
  fromLabel: string,
  toLabel: string
): RouteSummary | null => {
  if (!routePoints || routePoints.length < 2) return null;

  const steps: RouteStep[] = [];
  let totalDistancePixels = 0;

  const first = routePoints[0];
  const second = routePoints[1];

  pushMergedStep(
    steps,
    `Head ${getDirectionBucket(first, second)}`,
    pixelsToMeters(distance(first, second))
  );

  totalDistancePixels += distance(first, second);

  for (let i = 1; i < routePoints.length - 1; i++) {
    const prev = routePoints[i - 1];
    const current = routePoints[i];
    const next = routePoints[i + 1];

    const segmentDistancePixels = distance(current, next);
    totalDistancePixels += segmentDistancePixels;

    const turnText = getTurnInstruction(prev, current, next);
    const directionNow = getDirectionBucket(current, next);
    const directionBefore = getDirectionBucket(prev, current);

    if (turnText === "Continue straight" || directionNow === directionBefore) {
      pushMergedStep(
        steps,
        "Continue straight",
        pixelsToMeters(segmentDistancePixels)
      );
      continue;
    }

    pushMergedStep(steps, turnText, pixelsToMeters(segmentDistancePixels));
  }

  const straightLineDistanceMeters = pixelsToMeters(
    distance(routePoints[0], routePoints[routePoints.length - 1])
  );

  const totalDistanceMeters = pixelsToMeters(totalDistancePixels);

  return {
    from: fromLabel,
    to: toLabel,
    straightLineDistanceMeters,
    totalDistanceMeters,
    steps,
  };
};
