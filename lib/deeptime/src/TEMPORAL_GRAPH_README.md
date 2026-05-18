# Deep Time - Temporal Graph Model

A framework-agnostic model for representing graphical relationships over geologic time with support
for uncertainty.

## Installation

All exports are available from the main index:

```typescript
import {
  createTemporalGraph,
  addNode,
  addEdge,
  findCommonAncestor,
  GEOLOGIC_PERIODS,
  formatTimeYearsAgo,
  type TemporalNode,
  type TimePoint,
} from './common/deeptime';
```

## Core Concepts

### Time Representation

Time is measured in "years ago" (before present). The model supports both certain and uncertain time
measurements:

**Certain Time:**

```typescript
const time: TimePoint = 6_000_000; // Exactly 6 million years ago
```

**Uncertain Time:**

```typescript
const time: TimePoint = {
  min: 5_500_000,
  max: 7_500_000,
  best: 6_000_000, // Optional best estimate
};
```

### Why Uncertainty Matters

In deep time and evolutionary biology, dates are often estimates with significant uncertainty:

- Fossil dating may have error margins of millions of years
- Molecular clock estimates produce ranges rather than exact values
- Geological boundaries have fuzzy transitions
- Different dating methods may yield different results

### Working with Uncertain Times

The model provides helper functions:

```typescript
// Get the best estimate (best value, or midpoint if not specified)
const value = getTimeValue(time);

// Get the bounds
const earliest = getTimeMin(time);
const latest = getTimeMax(time);

// Check if a point intersects with a time range
const overlaps = timeIntersects(time, 6_200_000);

// Check if a value is uncertain
const isUncertain = isTimeRange(time);
```

## Usage Example

```typescript
import {createTemporalGraph, addNode, addEdge, findCommonAncestor} from './temporal-graph';

const graph = createTemporalGraph();

// Node with uncertain origin time
const human: TemporalNode = {
  id: 'human',
  name: 'Homo sapiens',
  timeOfOrigin: {
    min: 250_000,
    max: 350_000,
    best: 300_000,
  },
};

addNode(graph, human);

// Edge with uncertain divergence time
addEdge(graph, {
  id: 'e1',
  sourceId: 'ancestor',
  targetId: 'human',
  divergenceTime: {
    min: 5_500_000,
    max: 7_500_000,
    best: 6_000_000,
  },
});

// Query functions automatically handle uncertainty
const result = findCommonAncestor(graph, 'human', 'chimp');
console.log(result?.divergenceTime);
// Output: { min: 5_500_000, max: 7_500_000, best: 6_000_000 }
```

## API Reference

### Types

- `TimePoint` - Either a number or a `TimeRange`
- `TimeRange` - An object with `min`, `max`, and optional `best` estimate
- `TemporalNode` - A node with origin time and optional extinction time
- `TemporalEdge` - An edge with divergence time between nodes
- `TemporalGraph` - A graph containing nodes and edges

### Functions

**Time Utilities:**

- `isTimeRange(time)` - Check if time has uncertainty
- `getTimeValue(time)` - Get best estimate or midpoint
- `getTimeMin(time)` - Get earliest possible time
- `getTimeMax(time)` - Get latest possible time
- `timeIntersects(time, point)` - Check if point falls within range

**Graph Building:**

- `createTemporalGraph()` - Create empty graph
- `addNode(graph, node)` - Add a node
- `addEdge(graph, edge)` - Add an edge

**Graph Queries:**

- `findCommonAncestor(graph, nodeA, nodeB)` - Find common ancestor and divergence time
- `getLineage(graph, nodeId)` - Get ancestry chain
- `getDescendants(graph, nodeId)` - Get all descendants
- `getNodesAtTime(graph, time)` - Find nodes that existed at a time
- `getDivergenceTime(graph, nodeA, nodeB)` - Get divergence time

**Geologic Time Scale:**

- `getPeriodAtTime(time)` - Get geologic period for a time
- `getPeriodsInRange(start, end)` - Get all periods in a range
- `formatTimeYearsAgo(years)` - Format time for display

## Testing

Run tests with:

```bash
npm test -- temporal-graph
```

See `temporal-graph.example.ts` for a complete working example with primate evolution.
