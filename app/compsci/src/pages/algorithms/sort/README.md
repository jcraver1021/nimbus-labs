# Sorting

Step-by-step visualization of array sorting algorithms. One of the [Algorithms pages](../README.md).

Pick an algorithm, array size, and playback speed, then step through comparisons and swaps (or
reads/writes, for merge sort) as they happen, alongside the algorithm's pseudocode and time
complexity. Covers classics (bubble, selection, insertion, shell, merge, quicksort, heap sort) and a
couple of jokes (bogo sort, "I Can't Believe It Can Sort").

## Structure

- `sortAlgorithm.ts` (one level up) — the `FlatOps`/`MergeOps`/`QuickOps`/`HeapOps` shapes each
  algorithm implementation animates against
- `algorithms/` — one file per algorithm implementation
- `ArraySort.tsx` — the page itself: controls, algorithm info, and the active scene
- `*Scene.tsx` — one visualization component per algorithm shape (flat, merge, quick, heap)
- `common/AlgorithmInfoPanel.tsx` (shared with search) — wraps `@nimbus-labs/ui`'s `NimbusInfoPanel`
  with an algorithm's name, time complexity, and pseudocode
