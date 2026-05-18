/**
 * Example usage of the temporal graph model for phylogenetic relationships.
 * This demonstrates how to model evolutionary relationships and query them.
 */

import {
  createTemporalGraph,
  addNode,
  addEdge,
  findCommonAncestor,
  getLineage,
  getTimeValue,
  getTimeMin,
  getTimeMax,
  isTimeRange,
  type TemporalNode,
  type TemporalEdge,
  type TimePoint,
} from './temporal-graph';
import {getPeriodAtTime, formatTimeYearsAgo} from './geologic-time-scale';

function formatTimeWithUncertainty(time: TimePoint): string {
  if (isTimeRange(time)) {
    const best = formatTimeYearsAgo(time.best ?? getTimeValue(time));
    const min = formatTimeYearsAgo(getTimeMin(time));
    const max = formatTimeYearsAgo(getTimeMax(time));
    return `${best} (range: ${min} - ${max})`;
  }
  return formatTimeYearsAgo(time);
}

export function createPrimateEvolutionExample() {
  const graph = createTemporalGraph();

  const primateAncestor: TemporalNode = {
    id: 'primate-ancestor',
    name: 'Common Primate Ancestor',
    timeOfOrigin: 65_000_000,
    metadata: {description: 'Early primate ancestor from Paleocene'},
  };

  const apeAncestor: TemporalNode = {
    id: 'ape-ancestor',
    name: 'Common Ape Ancestor',
    timeOfOrigin: 28_000_000,
    metadata: {description: 'Great ape common ancestor'},
  };

  const hominidAncestor: TemporalNode = {
    id: 'hominid-ancestor',
    name: 'Human-Chimp Ancestor',
    timeOfOrigin: {min: 12_000_000, max: 14_000_000, best: 13_000_000},
    metadata: {description: 'Uncertain dating based on molecular clock'},
  };

  const human: TemporalNode = {
    id: 'human',
    name: 'Homo sapiens',
    timeOfOrigin: {min: 250_000, max: 350_000, best: 300_000},
    metadata: {commonName: 'Human', status: 'extant'},
  };

  const chimp: TemporalNode = {
    id: 'chimp',
    name: 'Pan troglodytes',
    timeOfOrigin: 2_000_000,
    metadata: {commonName: 'Chimpanzee', status: 'extant'},
  };

  const gorilla: TemporalNode = {
    id: 'gorilla',
    name: 'Gorilla gorilla',
    timeOfOrigin: 2_000_000,
    metadata: {commonName: 'Gorilla', status: 'extant'},
  };

  const neanderthal: TemporalNode = {
    id: 'neanderthal',
    name: 'Homo neanderthalensis',
    timeOfOrigin: 430_000,
    timeOfExtinction: 40_000,
    metadata: {commonName: 'Neanderthal', status: 'extinct'},
  };

  addNode(graph, primateAncestor);
  addNode(graph, apeAncestor);
  addNode(graph, hominidAncestor);
  addNode(graph, human);
  addNode(graph, chimp);
  addNode(graph, gorilla);
  addNode(graph, neanderthal);

  const edges: TemporalEdge[] = [
    {
      id: 'e1',
      sourceId: 'primate-ancestor',
      targetId: 'ape-ancestor',
      divergenceTime: 28_000_000,
    },
    {
      id: 'e2',
      sourceId: 'ape-ancestor',
      targetId: 'gorilla',
      divergenceTime: {min: 9_000_000, max: 11_000_000, best: 10_000_000},
    },
    {
      id: 'e3',
      sourceId: 'ape-ancestor',
      targetId: 'hominid-ancestor',
      divergenceTime: {min: 12_000_000, max: 14_000_000, best: 13_000_000},
    },
    {
      id: 'e4',
      sourceId: 'hominid-ancestor',
      targetId: 'human',
      divergenceTime: {min: 5_500_000, max: 7_500_000, best: 6_000_000},
    },
    {
      id: 'e5',
      sourceId: 'hominid-ancestor',
      targetId: 'chimp',
      divergenceTime: {min: 5_500_000, max: 7_500_000, best: 6_000_000},
    },
    {
      id: 'e6',
      sourceId: 'hominid-ancestor',
      targetId: 'neanderthal',
      divergenceTime: {min: 500_000, max: 600_000, best: 550_000},
    },
  ];

  edges.forEach(edge => addEdge(graph, edge));

  return graph;
}

export function demonstrateQueries() {
  const graph = createPrimateEvolutionExample();

  console.log('=== Primate Evolution Example ===\n');

  const humanChimpCA = findCommonAncestor(graph, 'human', 'chimp');
  if (humanChimpCA) {
    console.log('Human & Chimpanzee common ancestor:');
    console.log(`  Name: ${humanChimpCA.ancestor.name}`);
    console.log(
      `  Divergence: ${formatTimeWithUncertainty(humanChimpCA.divergenceTime)}`
    );
    const period = getPeriodAtTime(getTimeValue(humanChimpCA.divergenceTime));
    console.log(`  Period: ${period?.name} (${period?.era})\n`);
  }

  const humanGorillaCA = findCommonAncestor(graph, 'human', 'gorilla');
  if (humanGorillaCA) {
    console.log('Human & Gorilla common ancestor:');
    console.log(`  Name: ${humanGorillaCA.ancestor.name}`);
    console.log(
      `  Divergence: ${formatTimeWithUncertainty(humanGorillaCA.divergenceTime)}`
    );
    const period = getPeriodAtTime(getTimeValue(humanGorillaCA.divergenceTime));
    console.log(`  Period: ${period?.name} (${period?.era})\n`);
  }

  const humanLineage = getLineage(graph, 'human');
  console.log('Human lineage (descendant to ancestor):');
  humanLineage.forEach(node => {
    console.log(
      `  - ${node.name} (${formatTimeWithUncertainty(node.timeOfOrigin)})`
    );
  });

  return graph;
}
