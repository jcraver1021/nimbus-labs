import { describe, it, expect } from 'vitest';
import {
  createTemporalGraph,
  addNode,
  addEdge,
  getLineage,
  findCommonAncestor,
  getNodesAtTime,
  getDescendants,
  getDivergenceTime,
  getTimeValue,
  getTimeMin,
  getTimeMax,
  isTimeRange,
  timeIntersects,
  type TemporalNode,
  type TemporalEdge,
  type TimeRange,
} from './temporal-graph';

describe('temporal-graph', () => {
  describe('createTemporalGraph', () => {
    it('should create an empty graph', () => {
      const graph = createTemporalGraph();
      expect(graph.nodes.size).toBe(0);
      expect(graph.edges.size).toBe(0);
      expect(graph.timeRange).toEqual({ min: 0, max: 0 });
    });
  });

  describe('addNode', () => {
    it('should add a node to the graph', () => {
      const graph = createTemporalGraph();
      const node: TemporalNode = {
        id: 'human',
        name: 'Homo sapiens',
        timeOfOrigin: 300_000,
      };

      addNode(graph, node);

      expect(graph.nodes.get('human')).toEqual(node);
      expect(graph.timeRange.max).toBe(300_000);
    });

    it('should update time range for extinct species', () => {
      const graph = createTemporalGraph();
      const node: TemporalNode = {
        id: 'trex',
        name: 'Tyrannosaurus Rex',
        timeOfOrigin: 68_000_000,
        timeOfExtinction: 66_000_000,
      };

      addNode(graph, node);

      expect(graph.timeRange.min).toBe(66_000_000);
      expect(graph.timeRange.max).toBe(68_000_000);
    });
  });

  describe('addEdge', () => {
    it('should add an edge between nodes', () => {
      const graph = createTemporalGraph();
      const ancestor: TemporalNode = {
        id: 'ancestor',
        name: 'Common Ancestor',
        timeOfOrigin: 7_000_000,
        timeOfExtinction: 6_000_000,
      };
      const descendant: TemporalNode = {
        id: 'human',
        name: 'Homo sapiens',
        timeOfOrigin: 300_000,
      };

      addNode(graph, ancestor);
      addNode(graph, descendant);

      const edge: TemporalEdge = {
        id: 'edge1',
        sourceId: 'ancestor',
        targetId: 'human',
        divergenceTime: 6_000_000,
      };

      addEdge(graph, edge);

      expect(graph.edges.get('edge1')).toEqual(edge);
    });

    it('should throw error if nodes do not exist', () => {
      const graph = createTemporalGraph();
      const edge: TemporalEdge = {
        id: 'edge1',
        sourceId: 'nonexistent1',
        targetId: 'nonexistent2',
        divergenceTime: 1_000_000,
      };

      expect(() => addEdge(graph, edge)).toThrow(
        'Both source and target nodes must exist in the graph'
      );
    });
  });

  describe('getLineage', () => {
    it('should return lineage from descendant to root', () => {
      const graph = createTemporalGraph();

      const root: TemporalNode = {
        id: 'root',
        name: 'Root',
        timeOfOrigin: 10_000_000,
      };
      const middle: TemporalNode = {
        id: 'middle',
        name: 'Middle',
        timeOfOrigin: 5_000_000,
      };
      const leaf: TemporalNode = {
        id: 'leaf',
        name: 'Leaf',
        timeOfOrigin: 1_000_000,
      };

      addNode(graph, root);
      addNode(graph, middle);
      addNode(graph, leaf);

      addEdge(graph, {
        id: 'e1',
        sourceId: 'root',
        targetId: 'middle',
        divergenceTime: 5_000_000,
      });
      addEdge(graph, {
        id: 'e2',
        sourceId: 'middle',
        targetId: 'leaf',
        divergenceTime: 1_000_000,
      });

      const lineage = getLineage(graph, 'leaf');

      expect(lineage.map((n) => n.id)).toEqual(['leaf', 'middle', 'root']);
    });

    it('should return empty array for non-existent node', () => {
      const graph = createTemporalGraph();
      const lineage = getLineage(graph, 'nonexistent');
      expect(lineage).toEqual([]);
    });
  });

  describe('findCommonAncestor', () => {
    it('should find common ancestor of two nodes', () => {
      const graph = createTemporalGraph();

      const ancestor: TemporalNode = {
        id: 'ancestor',
        name: 'Common Ancestor',
        timeOfOrigin: 7_000_000,
      };
      const human: TemporalNode = {
        id: 'human',
        name: 'Human',
        timeOfOrigin: 300_000,
      };
      const chimp: TemporalNode = {
        id: 'chimp',
        name: 'Chimpanzee',
        timeOfOrigin: 2_000_000,
      };

      addNode(graph, ancestor);
      addNode(graph, human);
      addNode(graph, chimp);

      addEdge(graph, {
        id: 'e1',
        sourceId: 'ancestor',
        targetId: 'human',
        divergenceTime: 6_000_000,
      });
      addEdge(graph, {
        id: 'e2',
        sourceId: 'ancestor',
        targetId: 'chimp',
        divergenceTime: 6_000_000,
      });

      const result = findCommonAncestor(graph, 'human', 'chimp');

      expect(result).not.toBeNull();
      expect(result?.ancestor.id).toBe('ancestor');
      expect(result?.divergenceTime).toBe(6_000_000);
    });

    it('should return null if no common ancestor exists', () => {
      const graph = createTemporalGraph();

      const nodeA: TemporalNode = {
        id: 'a',
        name: 'A',
        timeOfOrigin: 1_000_000,
      };
      const nodeB: TemporalNode = {
        id: 'b',
        name: 'B',
        timeOfOrigin: 1_000_000,
      };

      addNode(graph, nodeA);
      addNode(graph, nodeB);

      const result = findCommonAncestor(graph, 'a', 'b');

      expect(result).toBeNull();
    });
  });

  describe('getNodesAtTime', () => {
    it('should return nodes that existed at given time', () => {
      const graph = createTemporalGraph();

      const ancient: TemporalNode = {
        id: 'ancient',
        name: 'Ancient',
        timeOfOrigin: 100_000_000,
        timeOfExtinction: 50_000_000,
      };
      const recent: TemporalNode = {
        id: 'recent',
        name: 'Recent',
        timeOfOrigin: 10_000_000,
      };

      addNode(graph, ancient);
      addNode(graph, recent);

      const nodesAt60M = getNodesAtTime(graph, 60_000_000);
      expect(nodesAt60M.map((n) => n.id)).toEqual(['ancient']);

      const nodesAt5M = getNodesAtTime(graph, 5_000_000);
      expect(nodesAt5M.map((n) => n.id)).toEqual(['recent']);
    });
  });

  describe('getDescendants', () => {
    it('should return all descendants of a node', () => {
      const graph = createTemporalGraph();

      const root: TemporalNode = {
        id: 'root',
        name: 'Root',
        timeOfOrigin: 10_000_000,
      };
      const child1: TemporalNode = {
        id: 'child1',
        name: 'Child 1',
        timeOfOrigin: 5_000_000,
      };
      const child2: TemporalNode = {
        id: 'child2',
        name: 'Child 2',
        timeOfOrigin: 5_000_000,
      };
      const grandchild: TemporalNode = {
        id: 'grandchild',
        name: 'Grandchild',
        timeOfOrigin: 1_000_000,
      };

      addNode(graph, root);
      addNode(graph, child1);
      addNode(graph, child2);
      addNode(graph, grandchild);

      addEdge(graph, {
        id: 'e1',
        sourceId: 'root',
        targetId: 'child1',
        divergenceTime: 5_000_000,
      });
      addEdge(graph, {
        id: 'e2',
        sourceId: 'root',
        targetId: 'child2',
        divergenceTime: 5_000_000,
      });
      addEdge(graph, {
        id: 'e3',
        sourceId: 'child1',
        targetId: 'grandchild',
        divergenceTime: 1_000_000,
      });

      const descendants = getDescendants(graph, 'root');

      expect(descendants.length).toBe(3);
      expect(descendants.map((n) => n.id).sort()).toEqual([
        'child1',
        'child2',
        'grandchild',
      ]);
    });
  });

  describe('getDivergenceTime', () => {
    it('should return divergence time for two nodes', () => {
      const graph = createTemporalGraph();

      const ancestor: TemporalNode = {
        id: 'ancestor',
        name: 'Ancestor',
        timeOfOrigin: 7_000_000,
      };
      const a: TemporalNode = {
        id: 'a',
        name: 'A',
        timeOfOrigin: 3_000_000,
      };
      const b: TemporalNode = {
        id: 'b',
        name: 'B',
        timeOfOrigin: 3_000_000,
      };

      addNode(graph, ancestor);
      addNode(graph, a);
      addNode(graph, b);

      addEdge(graph, {
        id: 'e1',
        sourceId: 'ancestor',
        targetId: 'a',
        divergenceTime: 6_000_000,
      });
      addEdge(graph, {
        id: 'e2',
        sourceId: 'ancestor',
        targetId: 'b',
        divergenceTime: 6_000_000,
      });

      const time = getDivergenceTime(graph, 'a', 'b');

      expect(time).toBe(6_000_000);
    });
  });

  describe('Time uncertainty', () => {
    describe('isTimeRange', () => {
      it('should identify time ranges', () => {
        expect(isTimeRange(1_000_000)).toBe(false);
        expect(isTimeRange({ min: 900_000, max: 1_100_000 })).toBe(true);
      });
    });

    describe('getTimeValue', () => {
      it('should return the value for certain time', () => {
        expect(getTimeValue(1_000_000)).toBe(1_000_000);
      });

      it('should return best estimate if provided', () => {
        const time: TimeRange = {
          min: 5_500_000,
          max: 7_000_000,
          best: 6_000_000,
        };
        expect(getTimeValue(time)).toBe(6_000_000);
      });

      it('should return midpoint if no best estimate', () => {
        const time: TimeRange = { min: 5_000_000, max: 7_000_000 };
        expect(getTimeValue(time)).toBe(6_000_000);
      });
    });

    describe('getTimeMin and getTimeMax', () => {
      it('should return same value for certain time', () => {
        expect(getTimeMin(1_000_000)).toBe(1_000_000);
        expect(getTimeMax(1_000_000)).toBe(1_000_000);
      });

      it('should return bounds for uncertain time', () => {
        const time: TimeRange = { min: 5_000_000, max: 7_000_000 };
        expect(getTimeMin(time)).toBe(5_000_000);
        expect(getTimeMax(time)).toBe(7_000_000);
      });
    });

    describe('timeIntersects', () => {
      it('should check if point falls within time range', () => {
        const time: TimeRange = { min: 5_000_000, max: 7_000_000 };
        expect(timeIntersects(time, 6_000_000)).toBe(true);
        expect(timeIntersects(time, 5_000_000)).toBe(true);
        expect(timeIntersects(time, 7_000_000)).toBe(true);
        expect(timeIntersects(time, 4_000_000)).toBe(false);
        expect(timeIntersects(time, 8_000_000)).toBe(false);
      });

      it('should work with certain time', () => {
        expect(timeIntersects(6_000_000, 6_000_000)).toBe(true);
        expect(timeIntersects(6_000_000, 5_000_000)).toBe(false);
      });
    });

    describe('nodes with uncertain times', () => {
      it('should handle nodes with uncertain origin times', () => {
        const graph = createTemporalGraph();

        const node: TemporalNode = {
          id: 'uncertain',
          name: 'Uncertain Species',
          timeOfOrigin: { min: 5_500_000, max: 7_000_000, best: 6_000_000 },
        };

        addNode(graph, node);

        expect(graph.nodes.get('uncertain')).toEqual(node);
        expect(graph.timeRange.max).toBe(7_000_000);
      });

      it('should handle edges with uncertain divergence times', () => {
        const graph = createTemporalGraph();

        const ancestor: TemporalNode = {
          id: 'ancestor',
          name: 'Ancestor',
          timeOfOrigin: 10_000_000,
        };
        const descendant: TemporalNode = {
          id: 'descendant',
          name: 'Descendant',
          timeOfOrigin: 2_000_000,
        };

        addNode(graph, ancestor);
        addNode(graph, descendant);

        addEdge(graph, {
          id: 'e1',
          sourceId: 'ancestor',
          targetId: 'descendant',
          divergenceTime: { min: 5_000_000, max: 8_000_000, best: 6_500_000 },
        });

        const edge = graph.edges.get('e1');
        expect(edge?.divergenceTime).toEqual({
          min: 5_000_000,
          max: 8_000_000,
          best: 6_500_000,
        });
      });

      it('should find common ancestor with uncertain times', () => {
        const graph = createTemporalGraph();

        const ancestor: TemporalNode = {
          id: 'ancestor',
          name: 'Ancestor',
          timeOfOrigin: { min: 12_000_000, max: 14_000_000 },
        };
        const a: TemporalNode = {
          id: 'a',
          name: 'A',
          timeOfOrigin: 3_000_000,
        };
        const b: TemporalNode = {
          id: 'b',
          name: 'B',
          timeOfOrigin: 3_000_000,
        };

        addNode(graph, ancestor);
        addNode(graph, a);
        addNode(graph, b);

        addEdge(graph, {
          id: 'e1',
          sourceId: 'ancestor',
          targetId: 'a',
          divergenceTime: { min: 5_500_000, max: 7_000_000, best: 6_000_000 },
        });
        addEdge(graph, {
          id: 'e2',
          sourceId: 'ancestor',
          targetId: 'b',
          divergenceTime: { min: 5_500_000, max: 7_000_000, best: 6_000_000 },
        });

        const result = findCommonAncestor(graph, 'a', 'b');

        expect(result).not.toBeNull();
        expect(result?.ancestor.id).toBe('ancestor');
        expect(getTimeValue(result!.divergenceTime)).toBe(6_000_000);
      });
    });
  });
});
