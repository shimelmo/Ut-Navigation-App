import { DOOR, EDGES, MPU, NODES, roomCenter } from "@/data/floorMapData";

type Point = { x: number; y: number };

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

const distance = (a: Point, b: Point) => {
  return Math.hypot(b.x - a.x, b.y - a.y);
};

const pixelsToMeters = (pixels: number) => {
  return Math.round(pixels * MPU);
};

const buildGraph = () => {
  const graph: Record<string, { node: string; dist: number }[]> = {};

  Object.keys(NODES).forEach((node) => {
    graph[node] = [];
  });

  EDGES.forEach(([a, b]) => {
    const d = distance(NODES[a], NODES[b]);
    graph[a].push({ node: b, dist: d });
    graph[b].push({ node: a, dist: d });
  });

  return graph;
};

const GRAPH = buildGraph();

export const astar = (startNode: string, goalNode: string) => {
  if (startNode === goalNode) return [startNode];

  const heuristic = (node: string) => distance(NODES[node], NODES[goalNode]);

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

    for (const next of GRAPH[current.node] || []) {
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

export const findRoute = (startRoomId: string, endRoomId: string) => {
  const startDoor = DOOR[startRoomId];
  const endDoor = DOOR[endRoomId];

  if (!startDoor || !endDoor) return null;

  const startPoint = roomCenter(startRoomId);
  const endPoint = roomCenter(endRoomId);

  if (startDoor === endDoor) {
    return [startPoint, NODES[startDoor], endPoint];
  }

  const nodePath = astar(startDoor, endDoor);
  if (!nodePath) return null;

  return [startPoint, ...nodePath.map((node) => NODES[node]), endPoint];
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

export const buildRouteSummary = (
  routePoints: Point[],
  fromLabel: string,
  toLabel: string
): RouteSummary | null => {
  if (!routePoints || routePoints.length < 2) return null;

  const steps: RouteStep[] = [];

  const first = routePoints[0];
  const second = routePoints[1];

  steps.push({
    text: `Head ${getCompassDirection(second.x - first.x, second.y - first.y)}`,
    distanceMeters: pixelsToMeters(distance(first, second)),
  });

  for (let i = 1; i < routePoints.length - 1; i++) {
    const prev = routePoints[i - 1];
    const current = routePoints[i];
    const next = routePoints[i + 1];

    steps.push({
      text: getTurnInstruction(prev, current, next),
      distanceMeters: pixelsToMeters(distance(current, next)),
    });
  }

  let totalPixels = 0;

  for (let i = 0; i < routePoints.length - 1; i++) {
    totalPixels += distance(routePoints[i], routePoints[i + 1]);
  }

  const straightLinePixels = distance(
    routePoints[0],
    routePoints[routePoints.length - 1]
  );

  return {
    from: fromLabel,
    to: toLabel,
    straightLineDistanceMeters: pixelsToMeters(straightLinePixels),
    totalDistanceMeters: pixelsToMeters(totalPixels),
    steps,
  };
};