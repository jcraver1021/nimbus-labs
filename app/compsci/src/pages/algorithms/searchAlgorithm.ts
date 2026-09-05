import {type AlgorithmBase} from '../../common/algorithm';
import {type QuickOps} from './sortAlgorithm';

/**
 * Operations for value-probing search algorithms (linear search, binary
 * search) — read-only access to the array, no swapping.
 */
export type ProbeOps = {
  readonly length: number;

  /**
   * Reads and highlights the element at index i, returning its value.
   * Lifts the element for the probe duration, like a sort's compare.
   */
  probe: (i: number) => Promise<number>;

  /**
   * Marks [lo, hi) as the current search window (e.g. binary search's
   * shrinking range). Optional — algorithms that don't call it (linear
   * search) simply show no range indicator.
   */
  setActiveRange?: (lo: number, hi: number) => Promise<void>;

  /** Clears the active range marker. */
  clearActiveRange?: () => Promise<void>;

  /** Marks the element at index as the found answer. */
  markFound: (index: number) => Promise<void>;
};

export type ProbeSearchAlgorithm = AlgorithmBase & {
  scene: 'probe';
  /** Searches for target, calling ops.markFound if it locates it. */
  search: (ops: ProbeOps, target: number) => Promise<void>;
};

export type QuickSelectAlgorithm = AlgorithmBase & {
  scene: 'quickselect';
  /**
   * Finds the k-th smallest element (0-indexed) via partitioning, reusing
   * the exact QuickOps shape quicksort uses.
   */
  search: (ops: QuickOps, k: number) => Promise<void>;
};

export type SearchAlgorithm = ProbeSearchAlgorithm | QuickSelectAlgorithm;
