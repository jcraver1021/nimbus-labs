import {describe, it, expect} from 'vitest';
import {
  createTemporalGraph,
  addNode,
  addEdge,
  findCommonAncestor,
  GEOLOGIC_PERIODS,
  formatTimeYearsAgo,
  type TemporalNode,
} from '@nimbus-labs/deeptime';

describe('deeptime library', () => {
  it('should create a temporal graph', () => {
    const graph = createTemporalGraph();
    const node: TemporalNode = {
      id: 'human',
      name: 'Homo sapiens',
      timeOfOrigin: 300_000,
    };
    addNode(graph, node);

    expect(graph.nodes.size).toBe(1);
    expect(graph.nodes.get('human')).toEqual(node);
  });

  it('should find common ancestors', () => {
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
  });

  it('should have geologic periods data', () => {
    expect(GEOLOGIC_PERIODS).toBeDefined();
    expect(GEOLOGIC_PERIODS.length).toBeGreaterThan(0);
    expect(GEOLOGIC_PERIODS[0].name).toBe('Holocene');
  });

  it('should format time correctly', () => {
    expect(formatTimeYearsAgo(300_000)).toBe('300.0k years ago');
    expect(formatTimeYearsAgo(6_000_000)).toBe('6.0M years ago');
    expect(formatTimeYearsAgo(65_000_000)).toBe('65.0M years ago');
  });
});
