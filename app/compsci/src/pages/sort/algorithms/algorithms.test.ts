import {describe, it, expect} from 'vitest';
import {
  type Algorithm,
  type FlatOps,
  type MergeOps,
  type HeapOps,
} from '../../../common/sortAlgorithm';
import {algorithms} from './index';

// ── Mock ops factories ─────────────────────────────────────────────────────

function mockFlatOps(arr: number[]): FlatOps {
  return {
    length: arr.length,
    compare: (i, j) => Promise.resolve(arr[i] > arr[j]),
    swap: (i, j) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return Promise.resolve();
    },
  };
}

function mockMergeOps(arr: number[]): MergeOps {
  return {
    length: arr.length,
    read: i => Promise.resolve(arr[i]),
    write: (i, value) => {
      arr[i] = value;
      return Promise.resolve();
    },
    compare: () => Promise.resolve(),
    setMergeRanges: () => Promise.resolve(),
    clearMergeRanges: () => Promise.resolve(),
  };
}

function mockHeapOps(arr: number[]): HeapOps {
  return {
    length: arr.length,
    compare: (i, j) => Promise.resolve(arr[i] > arr[j]),
    swap: (i, j) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return Promise.resolve();
    },
    setHeapSize: () => Promise.resolve(),
  };
}

function mockOps(
  algorithm: Algorithm,
  arr: number[]
): FlatOps | MergeOps | HeapOps {
  switch (algorithm.scene) {
    case 'flat':
      return mockFlatOps(arr);
    case 'merge':
      return mockMergeOps(arr);
    case 'heap':
      return mockHeapOps(arr);
  }
}

// ── Test cases ─────────────────────────────────────────────────────────────

const cases: [string, number[], number[]][] = [
  ['random', [5, 3, 8, 1, 9, 2, 7, 4, 6], [1, 2, 3, 4, 5, 6, 7, 8, 9]],
  ['already sorted', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
  ['reverse sorted', [5, 4, 3, 2, 1], [1, 2, 3, 4, 5]],
  ['duplicates', [3, 1, 4, 1, 5, 9, 2, 6, 5], [1, 1, 2, 3, 4, 5, 5, 6, 9]],
  ['single element', [42], [42]],
  ['empty', [], []],
];

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Sort algorithms', () => {
  for (const algorithm of algorithms) {
    describe(algorithm.name, () => {
      for (const [label, input, expected] of cases) {
        it(label, async () => {
          const arr = [...input];
          // Type assertion is safe: mockOps dispatches on the same scene value.
          await algorithm.sort(mockOps(algorithm, arr) as never);
          expect(arr).toEqual(expected);
        });
      }
    });
  }
});
