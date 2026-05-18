# Timeline Visualization

A scrollable visualization showing evolutionary relationships over deep time.

## Features

### Tree Structure Display

The visualization now shows the actual tree/forest relationships between nodes:

1. **Vertical Lines (Lineages)**: Each lineage is shown as a vertical blue line representing the
   time span that organism existed

2. **Branch Connections**: Orange lines connecting parent to child lineages:
   - Horizontal line from parent at divergence time
   - Vertical line down to child's origin time
   - Creates a clear branching pattern

3. **Divergence Markers**: Small orange circles marking where lineages split

4. **Smart Layout**: Nodes are positioned using a tree layout algorithm:
   - Root nodes (no parents) appear first
   - Children are positioned near their parents
   - Parent nodes are centered between their children
   - Multiple trees (forest) are spaced apart

### Geologic Time Scale

4-column hierarchy showing:

- **Eon** (Phanerozoic, Proterozoic, etc.)
- **Era** (Cenozoic, Mesozoic, Paleozoic)
- **Period** (Quaternary, Cretaceous, Jurassic, etc.)
- **Epoch** (Holocene, Pleistocene, etc.)

## Example: Arthropod Evolution

The current example shows arthropod lineages:

```
arthropod-ancestor (540 Ma)
├── trilobites (extinct 252 Ma)
├── chelicerates (spiders, scorpions)
├── myriapods (millipedes, centipedes)
└── crustacean-hexapod ancestor
    ├── crustaceans
    └── insects
```

### How to Read It

1. **Scroll down** to travel forward through time (past → present)
2. **Vertical blue lines** = when each group existed
3. **Orange branches** = where lineages split (divergence events)
4. **Labels on lines** = group name and origin time
5. **Geologic periods** on the left show geological context

## Data Structure

Uses `@nimbus-labs/deeptime` temporal graph:

```typescript
const graph = createTemporalGraph();

// Add nodes (organisms/lineages)
addNode(graph, {
  id: 'human',
  name: 'Homo sapiens',
  timeOfOrigin: 300_000,
  timeOfExtinction?: number, // if extinct
});

// Add edges (parent-child relationships)
addEdge(graph, {
  id: 'e1',
  sourceId: 'parent-id',
  targetId: 'child-id',
  divergenceTime: 6_000_000, // when they split
});
```

## Tree Layout Algorithm

The `calculateTreeLayout` utility automatically positions nodes:

1. Find root nodes (no incoming edges)
2. For each root, perform depth-first traversal
3. Layout children left-to-right
4. Position parent at center of its children
5. Add spacing between separate trees

This ensures the visual layout matches the actual tree structure.
