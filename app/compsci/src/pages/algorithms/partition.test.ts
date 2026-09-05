import {describe, it, expect} from 'vitest';
import {partitionLomuto} from './partition';

function mockOps(arr: number[]) {
  return {
    compare: (i: number, j: number) => Promise.resolve(arr[i] > arr[j]),
    swap: (i: number, j: number) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return Promise.resolve();
    },
    setPivot: () => Promise.resolve(),
    clearPivot: () => Promise.resolve(),
    markSorted: () => Promise.resolve(),
  };
}

describe('partitionLomuto', () => {
  it('picks the median of the first, middle, and last elements as the pivot', async () => {
    // low=0 (5), mid=2 (9), high=4 (1) -> median value is 5.
    const arr = [5, 3, 9, 7, 1];
    const pi = await partitionLomuto(mockOps(arr), 0, 4);
    expect(arr[pi]).toBe(5);
  });

  it('does not attempt median-of-three on ranges under 3 elements', async () => {
    const arr = [2, 1];
    const pi = await partitionLomuto(mockOps(arr), 0, 1);
    // Falls back to array[high] as the pivot, same as before median-of-three.
    expect(arr).toEqual([1, 2]);
    expect(pi).toBe(0);
  });

  for (const [label, input] of [
    ['already sorted', [1, 2, 3, 4, 5, 6, 7, 8]],
    ['reverse sorted', [8, 7, 6, 5, 4, 3, 2, 1]],
    ['random', [5, 3, 8, 1, 9, 2, 7, 4, 6]],
    ['duplicates', [3, 1, 4, 1, 5, 9, 2, 6, 5]],
  ] as const) {
    it(`maintains the Lomuto invariant on ${label} input`, async () => {
      const arr = [...input];
      const pi = await partitionLomuto(mockOps(arr), 0, arr.length - 1);

      for (let i = 0; i < pi; i++) {
        expect(arr[i]).toBeLessThan(arr[pi]);
      }
      for (let i = pi + 1; i < arr.length; i++) {
        expect(arr[i]).toBeGreaterThanOrEqual(arr[pi]);
      }
    });
  }
});
