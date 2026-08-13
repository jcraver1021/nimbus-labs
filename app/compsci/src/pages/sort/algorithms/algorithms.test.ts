import {describe, it, expect} from 'vitest';
import {type SortOps} from '../../../common/sortAlgorithm';
import {algorithms} from './index';

/** Builds a SortOps that operates directly on arr — no animation. */
function mockOps(arr: number[]): SortOps {
  return {
    length: arr.length,
    compare: (i, j) => Promise.resolve(arr[i] > arr[j]),
    swap: (i, j) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return Promise.resolve();
    },
  };
}

const cases: [string, number[], number[]][] = [
  ['random', [5, 3, 8, 1, 9, 2, 7, 4, 6], [1, 2, 3, 4, 5, 6, 7, 8, 9]],
  ['already sorted', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
  ['reverse sorted', [5, 4, 3, 2, 1], [1, 2, 3, 4, 5]],
  ['duplicates', [3, 1, 4, 1, 5, 9, 2, 6, 5], [1, 1, 2, 3, 4, 5, 5, 6, 9]],
  ['single element', [42], [42]],
  ['empty', [], []],
];

describe('Sort algorithms', () => {
  for (const algorithm of algorithms) {
    describe(algorithm.name, () => {
      for (const [label, input, expected] of cases) {
        it(label, async () => {
          const arr = [...input];
          await algorithm.sort(mockOps(arr));
          expect(arr).toEqual(expected);
        });
      }
    });
  }
});
