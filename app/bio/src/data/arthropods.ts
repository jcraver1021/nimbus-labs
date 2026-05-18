import {
  createTemporalGraph,
  addNode,
  addEdge,
  type TemporalGraph,
} from '@nimbus-labs/deeptime';

/**
 * Sample evolutionary data for arthropod lineages
 */
export function createArthropodGraph(): TemporalGraph {
  const graph = createTemporalGraph();

  // Nodes
  addNode(graph, {
    id: 'arthropod-ancestor',
    name: 'Arthropod Common Ancestor',
    timeOfOrigin: 540_000_000,
  });

  addNode(graph, {
    id: 'myriapod-ancestor',
    name: 'Myriapod Ancestor',
    timeOfOrigin: 430_000_000,
  });

  addNode(graph, {
    id: 'crustacean-ancestor',
    name: 'Crustacean-Hexapod Ancestor',
    timeOfOrigin: 479_000_000,
  });

  addNode(graph, {
    id: 'insects',
    name: 'Insects (Hexapoda)',
    timeOfOrigin: 400_000_000,
    metadata: {extant: true},
  });

  addNode(graph, {
    id: 'crustaceans',
    name: 'Crustaceans',
    timeOfOrigin: 511_000_000,
    metadata: {extant: true},
  });

  addNode(graph, {
    id: 'myriapods',
    name: 'Myriapods',
    timeOfOrigin: 428_000_000,
    metadata: {extant: true, examples: 'millipedes, centipedes'},
  });

  addNode(graph, {
    id: 'chelicerates',
    name: 'Chelicerates',
    timeOfOrigin: 445_000_000,
    metadata: {extant: true, examples: 'spiders, scorpions, horseshoe crabs'},
  });

  addNode(graph, {
    id: 'trilobites',
    name: 'Trilobites',
    timeOfOrigin: 521_000_000,
    timeOfExtinction: 251_900_000,
    metadata: {extant: false},
  });

  // Edges (divergence events)
  addEdge(graph, {
    id: 'e1',
    sourceId: 'arthropod-ancestor',
    targetId: 'trilobites',
    divergenceTime: 521_000_000,
  });

  addEdge(graph, {
    id: 'e2',
    sourceId: 'arthropod-ancestor',
    targetId: 'chelicerates',
    divergenceTime: {
      min: 500_000_000,
      max: 540_000_000,
      best: 520_000_000,
    },
  });

  addEdge(graph, {
    id: 'e3',
    sourceId: 'arthropod-ancestor',
    targetId: 'myriapod-ancestor',
    divergenceTime: {
      min: 475_000_000,
      max: 520_000_000,
      best: 497_000_000,
    },
  });

  addEdge(graph, {
    id: 'e4',
    sourceId: 'arthropod-ancestor',
    targetId: 'crustacean-ancestor',
    divergenceTime: {
      min: 475_000_000,
      max: 520_000_000,
      best: 497_000_000,
    },
  });

  addEdge(graph, {
    id: 'e5',
    sourceId: 'myriapod-ancestor',
    targetId: 'myriapods',
    divergenceTime: 430_000_000,
  });

  addEdge(graph, {
    id: 'e6',
    sourceId: 'crustacean-ancestor',
    targetId: 'crustaceans',
    divergenceTime: {
      min: 479_000_000,
      max: 511_000_000,
      best: 495_000_000,
    },
  });

  addEdge(graph, {
    id: 'e7',
    sourceId: 'crustacean-ancestor',
    targetId: 'insects',
    divergenceTime: {
      min: 390_000_000,
      max: 450_000_000,
      best: 420_000_000,
    },
  });

  return graph;
}
