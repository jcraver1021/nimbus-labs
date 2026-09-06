import {type AlgorithmBase} from '../../common/algorithm';

/**
 * Operations for in-place comparison/swap sort algorithms
 * (bubble sort, insertion sort, selection sort).
 */
export type FlatOps = {
  compare: (i: number, j: number) => Promise<boolean>; // Returns true if arr[i] > arr[j], lifting both elements for the comparison.

  swap: (i: number, j: number) => Promise<void>; // Visually swaps arr[i] and arr[j], rising the pair first if not already risen.

  readonly length: number; // Number of elements in the array.

  setActiveRange?: (lo: number, hi: number) => Promise<void>; // Marks [lo, hi) as the current outer-loop scope. Optional; unused algorithms show no range indicator.

  clearActiveRange?: () => Promise<void>; // Clears the active range marker.

  markSorted?: (index: number) => Promise<void>; // Marks the element as sorted for the rest of the run. Optional; unused algorithms show no sorted markers.
};

/**
 * Operations for merge sort — element values are read from and written
 * to positions rather than swapped.
 */
export type MergeOps = {
  readonly length: number;

  read: (i: number) => Promise<number>; // Reads the current value at index i. Briefly highlights the element.

  write: (i: number, value: number) => Promise<void>; // Writes value to index i, highlighting and updating the displayed value.

  compare: (i: number, j: number) => Promise<void>; // Purely visual comparison; lifts both candidates then lowers them. The algorithm decides the winner itself.

  setMergeRanges: (
    leftLo: number,
    leftHi: number,
    rightLo: number,
    rightHi: number
  ) => Promise<void>; // Shows the left/right range brackets below the array, animating between updates.

  clearMergeRanges: () => Promise<void>; // Clears both range brackets.
};

/**
 * Operations for quicksort — in-place partitioning around a pivot, with a
 * shrinking active range as recursion descends into sub-arrays.
 */
export type QuickOps = {
  readonly length: number;

  compare: (i: number, j: number) => Promise<boolean>; // Returns true if arr[i] > arr[j], lifting both elements for the comparison.

  swap: (i: number, j: number) => Promise<void>; // Visually swaps arr[i] and arr[j].

  setActiveRange: (lo: number, hi: number) => Promise<void>; // Marks [lo, hi) as the sub-array currently being partitioned.

  clearActiveRange: () => Promise<void>; // Clears the active-range marker.

  setPivot: (index: number) => Promise<void>; // Marks the element as the current pivot until clearPivot is called, even if `states` is cleared in between.

  clearPivot: () => Promise<void>; // Clears the pivot marker.

  markSorted: (index: number) => Promise<void>; // Marks the element as sorted for the rest of the run, like heap sort's sorted region.
};

/**
 * Operations for heap sort — in-place swaps with an explicit heap boundary.
 */
export type HeapOps = {
  readonly length: number;

  compare: (i: number, j: number) => Promise<boolean>; // Returns true if arr[i] > arr[j], highlighting both the tree and array nodes.

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
