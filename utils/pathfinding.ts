import { DOOR, EDGES, NODES, roomCenter } from "@/data/floorMapData";

type Point = { x: number; y: number };

const distance = (a: Point, b: Point) => {
  return Math.hypot(b.x - a.x, b.y - a.y);
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
  }[] = [{ f: heuristic(startNode), g: 0, node: startNode, path: [startNode] }];

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