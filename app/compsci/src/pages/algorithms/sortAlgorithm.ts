import {type AlgorithmBase} from '../../common/algorithm';

/**
 * Operations for in-place comparison/swap sort algorithms
 * (bubble sort, insertion sort, selection sort).
 */
export type FlatOps = {
  compare: (i: number, j: number) => Promise<boolean>; // Returns true if arr[i] > arr[j]; highlights and lifts both elements for the comparison duration, lowering a different previously-active pair first.

  swap: (i: number, j: number) => Promise<void>; // Visually swaps arr[i] and arr[j]; slides immediately if the pair is already risen from a compare call, otherwise rises the pair first.

  readonly length: number; // Number of elements in the array.

  setActiveRange?: (lo: number, hi: number) => Promise<void>; // Marks [lo, hi) as the current outer-loop scope (e.g. the unsorted portion still under consideration); optional, algorithms that don't call it simply show no range indicator.

  clearActiveRange?: () => Promise<void>; // Clears the active range marker.

  markSorted?: (index: number) => Promise<void>; // Marks the element at index as having reached its final sorted position, persisting for the remainder of the sort independent of setActiveRange; optional, algorithms that don't call it simply show no sorted markers until the sort completes.
};

/**
 * Operations for merge sort — element values are read from and written
 * to positions rather than swapped.
 */
export type MergeOps = {
  readonly length: number;

  read: (i: number) => Promise<number>; // Reads the current value at index i. Briefly highlights the element.

  write: (i: number, value: number) => Promise<void>; // Writes value to index i, highlighting the element and updating the displayed value.

  compare: (i: number, j: number) => Promise<void>; // Visual comparison: lifts the left candidate at position i (blue) and the right candidate at position j (teal) for the comparison duration, then lowers both; purely visual, the algorithm decides the winner from its own aux copy.

  setMergeRanges: (
    leftLo: number,
    leftHi: number,
    rightLo: number,
    rightHi: number
  ) => Promise<void>; // Shows two range brackets below the array — left half [leftLo, leftHi) in blue, right half [rightLo, rightHi) in teal — animating via CSS transitions on each update with no extra delay.

  clearMergeRanges: () => Promise<void>; // Clears both range brackets.
};

/**
 * Operations for quicksort — in-place partitioning around a pivot, with a
 * shrinking active range as recursion descends into sub-arrays.
 */
export type QuickOps = {
  readonly length: number;

  compare: (i: number, j: number) => Promise<boolean>; // Returns true if arr[i] > arr[j]; highlights and lifts both elements for the comparison duration.

  swap: (i: number, j: number) => Promise<void>; // Visually swaps arr[i] and arr[j].

  setActiveRange: (lo: number, hi: number) => Promise<void>; // Marks [lo, hi) as the sub-array currently being partitioned, replacing any previously active range.

  clearActiveRange: () => Promise<void>; // Clears the active-range marker.

  setPivot: (index: number) => Promise<void>; // Marks the element at index as the pivot for the current partition; the marker follows that element even if the underlying `states` map (used for comparisons) is cleared in between, persisting until clearPivot is called.

  clearPivot: () => Promise<void>; // Clears the pivot marker.

  markSorted: (index: number) => Promise<void>; // Marks the element at index as having reached its final sorted position, persisting for the remainder of the sort, like heap sort's sorted region.
};

/**
 * Operations for heap sort — in-place swaps with an explicit heap boundary.
 */
export type HeapOps = {
  readonly length: number;

  compare: (i: number, j: number) => Promise<boolean>; // Returns true if arr[i] > arr[j]; highlights both nodes in the tree and in the array.

  swap: (i: number, j: number) => Promise<void>; // Swaps elements at indices i and j.

  setHeapSize: (size: number) => Promise<void>; // Sets the current heap size. Elements at index >= size are marked as sorted.
};

export type FlatAlgorithm = AlgorithmBase & {
  scene: 'flat';
  sort: (ops: FlatOps) => Promise<void>;
};

export type MergeAlgorithm = AlgorithmBase & {
  scene: 'merge';
  sort: (ops: MergeOps) => Promise<void>;
};

export type HeapAlgorithm = AlgorithmBase & {
  scene: 'heap';
  sort: (ops: HeapOps) => Promise<void>;
};

export type QuickAlgorithm = AlgorithmBase & {
  scene: 'quick';
  sort: (ops: QuickOps) => Promise<void>;
};

export type Algorithm =
  FlatAlgorithm | MergeAlgorithm | HeapAlgorithm | QuickAlgorithm;

// Backward-compat aliases so the existing test file compiles unchanged.
/** @deprecated Use FlatOps */
export type SortOps = FlatOps;
/** @deprecated Use FlatAlgorithm */
export type SortAlgorithm = FlatAlgorithm;
