/**
 * Framework-agnostic model for representing graphical relationships over geologic time.
 * Supports phylogenetic trees, evolutionary relationships, and temporal ancestor-descendant visualizations.
 */

export interface TimeRange {
  min: number;
  max: number;
  best?: number;
}

export type TimePoint = number | TimeRange;

export function isTimeRange(time: TimePoint): time is TimeRange {
  return typeof time === 'object' && 'min' in time && 'max' in time;
}

export function getTimeValue(time: TimePoint): number {
  if (isTimeRange(time)) {
    return time.best ?? (time.min + time.max) / 2;
  }
  return time;
}

export function getTimeMin(time: TimePoint): number {
  return isTimeRange(time) ? time.min : time;
}

export function getTimeMax(time: TimePoint): number {
  return isTimeRange(time) ? time.max : time;
}

export function timeIntersects(time: TimePoint, point: number): boolean {
  const min = getTimeMin(time);
  const max = getTimeMax(time);
  return point >= min && point <= max;
}

export interface TemporalNode {
  id: string;
  name: string;
  timeOfOrigin: TimePoint;
  timeOfExtinction?: TimePoint;
  metadata?: Record<string, unknown>;
}

export interface TemporalEdge {
  id: string;
  sourceId: string;
  targetId: string;
  divergenceTime: TimePoint;
}

export interface TemporalGraph {
  nodes: Map<string, TemporalNode>;
  edges: Map<string, TemporalEdge>;
  timeRange: {min: number; max: number};
}

export interface GeologicPeriod {
  name: string;
  start: number;
  end: number;
  level: 'eon' | 'era' | 'period' | 'epoch' | 'sub-epoch' | 'age' | 'sub-age';
  eon?: string;
  era?: string;
  period?: string;
  epoch?: string;
  subEpoch?: string;
  color?: string;
}

export function createTemporalGraph(): TemporalGraph {
  return {
    nodes: new Map(),
    edges: new Map(),
    timeRange: {min: 0, max: 0},
  };
}

export function addNode(
  graph: TemporalGraph,
  node: TemporalNode
): TemporalGraph {
  graph.nodes.set(node.id, node);

  const extinctionMin = node.timeOfExtinction
    ? getTimeMin(node.timeOfExtinction)
    : getTimeMin(node.timeOfOrigin);
  const originMax = getTimeMax(node.timeOfOrigin);

  graph.timeRange.min = Math.max(graph.timeRange.min, extinctionMin);
  graph.timeRange.max = Math.max(graph.timeRange.max, originMax);

  return graph;
}

export function addEdge(
  graph: TemporalGraph,
  edge: TemporalEdge
): TemporalGraph {
  if (!graph.nodes.has(edge.sourceId) || !graph.nodes.has(edge.targetId)) {
    throw new Error('Both source and target nodes must exist in the graph');
  }

  graph.edges.set(edge.id, edge);

  graph.timeRange.max = Math.max(
    graph.timeRange.max,
    getTimeMax(edge.divergenceTime)
  );

  return graph;
}

export function getLineage(
  graph: TemporalGraph,
  nodeId: string
): TemporalNode[] {
  const lineage: TemporalNode[] = [];
  const node = graph.nodes.get(nodeId);

  if (!node) {
    return lineage;
  }

  lineage.push(node);
  let currentId = nodeId;

  while (true) {
    const parentEdge = Array.from(graph.edges.values()).find(
      edge => edge.targetId === currentId
    );

    if (!parentEdge) {
      break;
    }

    const parentNode = graph.nodes.get(parentEdge.sourceId);
    if (!parentNode) {
      break;
    }

    lineage.push(parentNode);
    currentId = parentEdge.sourceId;
  }

  return lineage;
}

export function findCommonAncestor(
  graph: TemporalGraph,
  nodeAId: string,
  nodeBId: string
): {ancestor: TemporalNode; divergenceTime: TimePoint} | null {
  const lineageA = getLineage(graph, nodeAId);
  const lineageB = getLineage(graph, nodeBId);

  if (lineageA.length === 0 || lineageB.length === 0) {
    return null;
  }

  const lineageAIds = new Set(lineageA.map(n => n.id));

  for (const ancestorNode of lineageB) {
    if (lineageAIds.has(ancestorNode.id)) {
      const edgeToA = findEdgeToDescendant(graph, ancestorNode.id, nodeAId);
      const edgeToB = findEdgeToDescendant(graph, ancestorNode.id, nodeBId);

      const timeA = edgeToA?.divergenceTime ?? ancestorNode.timeOfOrigin;
      const timeB = edgeToB?.divergenceTime ?? ancestorNode.timeOfOrigin;

      const divergenceTime =
        getTimeValue(timeA) > getTimeValue(timeB) ? timeA : timeB;

      return {
        ancestor: ancestorNode,
        divergenceTime,
      };
    }
  }

  return null;
}

function findEdgeToDescendant(
  graph: TemporalGraph,
  ancestorId: string,
  descendantId: string
): TemporalEdge | null {
  const lineage = getLineage(graph, descendantId);
  const ancestorIndex = lineage.findIndex(n => n.id === ancestorId);

  if (ancestorIndex === -1 || ancestorIndex === 0) {
    return null;
  }

  const childNode = lineage[ancestorIndex - 1];

  return (
    Array.from(graph.edges.values()).find(
      edge => edge.sourceId === ancestorId && edge.targetId === childNode.id
    ) ?? null
  );
}

export function getNodesAtTime(
  graph: TemporalGraph,
  time: number
): TemporalNode[] {
  return Array.from(graph.nodes.values()).filter(node => {
    const originMin = getTimeMin(node.timeOfOrigin);
    const extinctionMax = node.timeOfExtinction
      ? getTimeMax(node.timeOfExtinction)
      : 0;

    const existedAtTime = originMin >= time;
    const notExtinct = !node.timeOfExtinction || extinctionMax <= time;
    return existedAtTime && notExtinct;
  });
}

export function getDescendants(
  graph: TemporalGraph,
  nodeId: string
): TemporalNode[] {
  const descendants: TemporalNode[] = [];
  const queue: string[] = [nodeId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (visited.has(currentId)) {
      continue;
    }
    visited.add(currentId);

    const childEdges = Array.from(graph.edges.values()).filter(
      edge => edge.sourceId === currentId
    );

    for (const edge of childEdges) {
      const childNode = graph.nodes.get(edge.targetId);
      if (childNode) {
        descendants.push(childNode);
        queue.push(edge.targetId);
      }
    }
  }

  return descendants;
}

export function getDivergenceTime(
  graph: TemporalGraph,
  nodeAId: string,
  nodeBId: string
): TimePoint | null {
  const result = findCommonAncestor(graph, nodeAId, nodeBId);
  return result?.divergenceTime ?? null;
}
