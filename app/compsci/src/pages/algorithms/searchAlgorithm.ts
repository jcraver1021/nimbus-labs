import {type AlgorithmBase} from '../../common/algorithm';
import {type QuickOps} from './sortAlgorithm';

/**
 * Operations for value-probing search algorithms (linear search, binary
 * search) — read-only access to the array, no swapping.
 */
export type ProbeOps = {
  readonly length: number;

  probe: (i: number) => Promise<number>; // Reads and highlights the element at index i, like a sort's compare.

  setActiveRange?: (lo: number, hi: number) => Promise<void>; // Marks [lo, hi) as the current search window. Optional; unused algorithms show no range indicator.

  clearActiveRange?: () => Promise<void>; // Clears the active range marker.

  markFound: (index: number) => Promise<void>; // Marks the element at index as the found answer.
};

export type ProbeSearchAlgorithm = AlgorithmBase & {
  scene: 'probe';
  search: (ops: ProbeOps, target: number) => Promise<void>; // Searches for target, calling ops.markFound if it locates it.
};

export type QuickSelectAlgorithm = AlgorithmBase & {
  scene: 'quickselect';
  search: (ops: QuickOps, k: number) => Promise<void>; // Finds the k-th smallest element (0-indexed) via partitioning.
};

export type SearchAlgorithm = ProbeSearchAlgorithm | QuickSelectAlgorithm;
