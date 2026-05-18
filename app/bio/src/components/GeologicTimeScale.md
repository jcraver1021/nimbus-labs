# Geologic Time Scale Component

This component displays the hierarchical structure of geologic time in three columns:

## Structure

```
┌──────────┬───────────┬──────────────────┐
│   ERA    │   EPOCH   │     PERIOD       │
├──────────┼───────────┼──────────────────┤
│          │           │ Holocene         │
│          │Quaternary ├──────────────────┤
│          │           │ Pleistocene      │
│          ├───────────┼──────────────────┤
│          │           │ Pliocene         │
│ Cenozoic │ Neogene   ├──────────────────┤
│          │           │ Miocene          │
│          ├───────────┼──────────────────┤
│          │           │ Oligocene        │
│          │Paleogene  ├──────────────────┤
│          │           │ Eocene           │
│          │           ├──────────────────┤
│          │           │ Paleocene        │
├──────────┼───────────┼──────────────────┤
│          │           │ Late Cretaceous  │
│          │Cretaceous ├──────────────────┤
│          │           │ Early Cretaceous │
│          ├───────────┼──────────────────┤
│ Mesozoic │           │ Late Jurassic    │
│          │ Jurassic  ├──────────────────┤
│          │           │ Middle Jurassic  │
│          │           ├──────────────────┤
│          │           │ Early Jurassic   │
│          ├───────────┼──────────────────┤
│          │           │ Late Triassic    │
│          │ Triassic  ├──────────────────┤
│          │           │ Middle Triassic  │
│          │           ├──────────────────┤
│          │           │ Early Triassic   │
└──────────┴───────────┴──────────────────┘
```

## Hierarchy Levels

1. **Era** (e.g., Cenozoic, Mesozoic, Paleozoic, Precambrian)
   - Largest divisions of geologic time
   - Marked with bold vertical labels and colored left border
   
2. **Epoch** (e.g., Quaternary, Neogene, Paleogene)
   - Subdivisions of Eras
   - Shown in middle column with era-specific colors
   
3. **Period** (e.g., Holocene, Pleistocene, Pliocene)
   - Smallest divisions shown
   - Individual color bands based on geological convention
   - Rightmost column

## Usage

```tsx
<GeologicTimeScale
  timeRange={{start: 550_000_000, end: 0}}
  totalYears={550_000_000}
  timelineHeight={1100}
/>
```

## Visual Design

- **Width**: 320px total (80px Era + 100px Epoch + 140px Period)
- **Colors**: Era-specific colors with period-specific detail colors
- **Borders**: Visual hierarchy through borders between columns
- **Labels**: Vertical text for Era/Epoch, horizontal for Period names
