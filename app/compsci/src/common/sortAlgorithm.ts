/**
 * Operations for in-place comparison/swap sort algorithms
 * (bubble sort, insertion sort, selection sort).
 */
export type FlatOps = {
  /**
   * Returns true if arr[i] > arr[j].
   * Highlights and lifts both elements for the comparison duration.
   * If a different pair was previously active, it is lowered first.
   */
  compare: (i: number, j: number) => Promise<boolean>;

  /**
   * Visually swaps arr[i] and arr[j].
   * If the pair is already risen from a compare call, the slide begins
   * immediately. Otherwise the pair is risen first.
   */
  swap: (i: number, j: number) => Promise<void>;

  /** Number of elements in the array. */
  readonly length: number;

  /**
   * Marks [lo, hi) as the current outer-loop scope (e.g. the unsorted
   * portion still under consideration). Optional — algorithms that don't
   * call it simply show no range indicator.
   */
  setActiveRange?: (lo: number, hi: number) => Promise<void>;

  /** Clears the active range marker. */
  clearActiveRange?: () => Promise<void>;
};

/**
 * Operations for merge sort — element values are read from and written
 * to positions rather than swapped.
 */
export type MergeOps = {
  readonly length: number;

  /** Reads the current value at index i. Briefly highlights the element. */
  read: (i: number) => Promise<number>;

  /**
   * Writes value to index i.
   * Highlights the element and updates the displayed value.
   */
  write: (i: number, value: number) => Promise<void>;

  /**
   * Visual comparison: lifts the left candidate at position i (blue) and the
   * right candidate at position j (teal) for the comparison duration, then
   * lowers both. Purely visual — the algorithm decides the winner from its
   * own aux copy.
   */
  compare: (i: number, j: number) => Promise<void>;

  /**
   * Shows two range brackets below the array:
   *   - left half  [leftLo, leftHi)  in blue
   *   - right half [rightLo, rightHi) in teal
   * Brackets animate via CSS transitions on each update — no extra delay.
   */
  setMergeRanges: (
    leftLo: number,
    leftHi: number,
    rightLo: number,
    rightHi: number
  ) => Promise<void>;

  /** Clears both range brackets. */
  clearMergeRanges: () => Promise<void>;
};

/**
 * Operations for heap sort — in-place swaps with an explicit heap boundary.
 */
export type HeapOps = {
  readonly length: number;

  /**
   * Returns true if arr[i] > arr[j].
   * Highlights both nodes in the tree and in the array.
   */
  compare: (i: number, j: number) => Promise<boolean>;

  /** Swaps elements at indices i and j. */
  swap: (i: number, j: number) => Promise<void>;

  /**
   * Sets the current heap size.
   * Elements at index >= size are marked as sorted.
   */
  setHeapSize: (size: number) => Promise<void>;
};

export type AlgorithmMetadata = {
  timeComplexity: string;
};

type AlgorithmBase = {
  name: string;
  metadata: AlgorithmMetadata;
  /** Source code shown to the viewer alongside the visualization. */
  code: string;
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

export type Algorithm = FlatAlgorithm | MergeAlgorithm | HeapAlgorithm;

// Backward-compat aliases so the existing test file compiles unchanged.
/** @deprecated Use FlatOps */
export type SortOps = FlatOps;
/** @deprecated Use FlatAlgorithm */
export type SortAlgorithm = FlatAlgorithm;
