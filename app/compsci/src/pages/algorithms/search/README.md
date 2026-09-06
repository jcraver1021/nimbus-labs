# Searching

Step-by-step visualization of array search algorithms. One of the [Algorithms pages](../README.md).

Pick an algorithm, array size, and a target value (or `k` for quickselect), then step through probes
and range narrowing as they happen, alongside the algorithm's pseudocode and time complexity. The
array is always kept sorted, since binary search requires it. Covers linear search, binary search,
quickselect (with a fixed or random pivot), and bogo search.

## Structure

- `searchAlgorithm.ts` (one level up) — the `ProbeOps` shape linear/binary search animate against;
  quickselect reuses sort's `QuickOps`
- `algorithms/` — one file per algorithm implementation
- `ArraySearch.tsx` — the page itself: controls, algorithm info, and the active scene
- `ProbeSearchScene.tsx` / `QuickSelectScene.tsx` — the two visualization shapes
- `common/AlgorithmInfoPanel.tsx` (shared with sort) — wraps `@nimbus-labs/ui`'s `NimbusInfoPanel`
  with an algorithm's name, time complexity, and pseudocode
