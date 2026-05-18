import type {TemporalGraph} from '@nimbus-labs/deeptime';

/**
 * Calculate horizontal positions for nodes in a tree layout
 */
export function calculateTreeLayout(
  graph: TemporalGraph,
  xSpacing = 100
): Map<string, number> {
  const positions = new Map<string, number>();
  const visited = new Set<string>();

  // Find root nodes (nodes with no incoming edges)
  const roots = Array.from(graph.nodes.values()).filter(node => {
    return !Array.from(graph.edges.values()).some(
      edge => edge.targetId === node.id
    );
  });

  let currentX = 0;

  // Depth-first layout from each root
  roots.forEach(root => {
    currentX = layoutSubtree(
      graph,
      root.id,
      currentX,
      xSpacing,
      positions,
      visited
    );
    currentX += xSpacing; // Extra space between trees in a forest
  });

  return positions;
}

function layoutSubtree(
  graph: TemporalGraph,
  nodeId: string,
  startX: number,
  xSpacing: number,
  positions: Map<string, number>,
  visited: Set<string>
): number {
  if (visited.has(nodeId)) return startX;
  visited.add(nodeId);

  // Get children of this node
  const children = Array.from(graph.edges.values())
    .filter(edge => edge.sourceId === nodeId)
    .map(edge => edge.targetId);

  if (children.length === 0) {
    // Leaf node - assign position
    positions.set(nodeId, startX);
    return startX + xSpacing;
  }

  // Layout children first
  let childX = startX;
  const childPositions: number[] = [];

  children.forEach(childId => {
    const childNode = graph.nodes.get(childId);
    if (childNode) {
      childX = layoutSubtree(
        graph,
        childId,
        childX,
        xSpacing,
        positions,
        visited
      );
      const pos = positions.get(childId);
      if (pos !== undefined) {
        childPositions.push(pos);
      }
    }
  });

  // Position parent at center of children
  if (childPositions.length > 0) {
    const avgPos =
      childPositions.reduce((sum, pos) => sum + pos, 0) / childPositions.length;
    positions.set(nodeId, avgPos);
  } else {
    positions.set(nodeId, startX);
  }

  return childX;
}
