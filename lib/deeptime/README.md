# @nimbus-labs/deeptime

A framework-agnostic TypeScript library for representing graphical relationships over geologic time with support for uncertainty.

## Features

- **Temporal Graphs**: Model ancestor-descendant relationships with time-based nodes and edges
- **Uncertainty Support**: Represent dates as ranges with min/max/best estimates
- **Geologic Time Scale**: Built-in data for 27+ geologic periods from Holocene to Cryogenian
- **Query Functions**: Find common ancestors, lineages, divergence times, and more
- **Framework Agnostic**: Pure TypeScript with no runtime dependencies

## Installation

This is a workspace package in the Nimbus Labs monorepo. To use it in another workspace:

```json
{
  "dependencies": {
    "@nimbus-labs/deeptime": "*"
  }
}
```

Then run `npm install` from the root of the monorepo.

## Usage

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
} from '@nimbus-labs/deeptime';

// Create a graph
const graph = createTemporalGraph();

// Add nodes with uncertain times
const human: TemporalNode = {
  id: 'human',
  name: 'Homo sapiens',
  timeOfOrigin: {
    min: 250_000,
    max: 350_000,
    best: 300_000
  }
};

const chimp: TemporalNode = {
  id: 'chimp',
  name: 'Pan troglodytes',
  timeOfOrigin: 2_000_000
};

addNode(graph, human);
addNode(graph, chimp);

// Add edges
addEdge(graph, {
  id: 'e1',
  sourceId: 'ancestor',
  targetId: 'human',
  divergenceTime: {
    min: 5_500_000,
    max: 7_500_000,
    best: 6_000_000
  }
});

// Query the graph
const result = findCommonAncestor(graph, 'human', 'chimp');
console.log(result?.divergenceTime); // { min: 5_500_000, max: 7_500_000, best: 6_000_000 }

// Use geologic time scale
console.log(GEOLOGIC_PERIODS[0].name); // "Holocene"
console.log(formatTimeYearsAgo(6_000_000)); // "6.0M years ago"
```

## API Reference

### Time Types

- `TimePoint` - A number (certain time) or `TimeRange` (uncertain time)
- `TimeRange` - `{ min: number; max: number; best?: number }`

### Graph Types

- `TemporalNode` - A node with origin time and optional extinction time
- `TemporalEdge` - An edge with divergence time between nodes
- `TemporalGraph` - A graph containing nodes and edges

### Functions

**Time Utilities:**
- `isTimeRange(time)` - Check if time has uncertainty
- `getTimeValue(time)` - Get best estimate or midpoint
- `getTimeMin(time)` / `getTimeMax(time)` - Get bounds
- `timeIntersects(time, point)` - Check if point falls within range

**Graph Building:**
- `createTemporalGraph()` - Create empty graph
- `addNode(graph, node)` - Add a node
- `addEdge(graph, edge)` - Add an edge

**Graph Queries:**
- `findCommonAncestor(graph, nodeA, nodeB)` - Find common ancestor
- `getLineage(graph, nodeId)` - Get ancestry chain
- `getDescendants(graph, nodeId)` - Get all descendants
- `getNodesAtTime(graph, time)` - Find nodes at a time
- `getDivergenceTime(graph, nodeA, nodeB)` - Get divergence time

**Geologic Time Scale:**
- `GEOLOGIC_PERIODS` - Array of 27+ geologic periods
- `getPeriodAtTime(time)` - Get geologic period for a time
- `getPeriodsInRange(start, end)` - Get all periods in a range
- `formatTimeYearsAgo(years)` - Format time for display

## Development

```bash
# Run tests
npm test

# Build library
npm run build

# Clean build artifacts
npm run clean
```

## Examples

See `src/temporal-graph.example.ts` for a complete example showing primate evolution with uncertainty.

## License

MIT
