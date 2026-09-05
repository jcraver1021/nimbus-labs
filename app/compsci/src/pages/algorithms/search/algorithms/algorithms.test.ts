import {describe, it, expect} from 'vitest';
import {
  type ProbeOps,
  type ProbeSearchAlgorithm,
  type QuickSelectAlgorithm,
} from '../../searchAlgorithm';
import {type QuickOps} from '../../sortAlgorithm';
import {searchAlgorithms} from './index';

// ── Mock ops factories ─────────────────────────────────────────────────────

function mockProbeOps(arr: number[]) {
  let foundIndex: number | null = null;
  const ops: ProbeOps = {
    length: arr.length,
    probe: i => Promise.resolve(arr[i]),
    setActiveRange: () => Promise.resolve(),
    clearActiveRange: () => Promise.resolve(),
    markFound: i => {
      foundIndex = i;
      return Promise.resolve();
    },
  };
  return {ops, getFoundIndex: () => foundIndex};
}

function mockQuickOps(arr: number[]): QuickOps {
  return {
    length: arr.length,
    compare: (i, j) => Promise.resolve(arr[i] > arr[j]),
    swap: (i, j) => {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return Promise.resolve();
    },
    setActiveRange: () => Promise.resolve(),
    clearActiveRange: () => Promise.resolve(),
    setPivot: () => Promise.resolve(),
    clearPivot: () => Promise.resolve(),
    markSorted: () => Promise.resolve(),
  };
}

// ── Probe search algorithms (linear, binary) ────────────────────────────────

const probeAlgorithms = searchAlgorithms.filter(
  (a): a is ProbeSearchAlgorithm => a.scene === 'probe' && !a.skipInTests
);

// Inputs are sorted ascending, matching what the search page always generates.
const probeCases: [string, number[], number][] = [
  ['random, target present', [1, 2, 3, 4, 5, 6, 7, 8, 9], 7],
  ['random, target absent', [1, 2, 3, 4, 5, 6, 7, 8, 9], 10],
  ['duplicates, target present', [1, 3, 3, 3, 5], 3],
  ['single element, target present', [42], 42],
  ['single element, target absent', [42], 0],
  ['empty, target absent', [], 5],
];

describe('Search algorithms', () => {
  for (const algorithm of probeAlgorithms) {
    describe(algorithm.name, () => {
      for (const [label, input, target] of probeCases) {
        it(label, async () => {
          const arr = [...input];
          const {ops, getFoundIndex} = mockProbeOps(arr);
          await algorithm.search(ops, target);

          const expectedIndex = arr.indexOf(target);
          if (expectedIndex === -1) {
            expect(getFoundIndex()).toBeNull();
          } else {
            const found = getFoundIndex();
            expect(found).not.toBeNull();
            expect(arr[found!]).toBe(target);
          }
        });
      }
    });
  }

  const quickSelectAlgorithms = searchAlgorithms.filter(
    (a): a is QuickSelectAlgorithm =>
      a.scene === 'quickselect' && !a.skipInTests
  );

  const quickSelectCases: [string, number[]][] = [
    ['random', [5, 3, 8, 1, 9, 2, 7, 4, 6]],
    ['already sorted', [1, 2, 3, 4, 5]],
    ['reverse sorted', [5, 4, 3, 2, 1]],
    ['duplicates', [3, 1, 4, 1, 5, 9, 2, 6, 5]],
    ['single element', [42]],
  ];

  for (const algorithm of quickSelectAlgorithms) {
    describe(algorithm.name, () => {
      for (const [label, input] of quickSelectCases) {
        it(`${label}: finds every k-th smallest`, async () => {
          const expectedSorted = [...input].sort((a, b) => a - b);

          for (let k = 0; k < input.length; k++) {
            const arr = [...input];
            await algorithm.search(mockQuickOps(arr), k);
            expect(arr[k]).toBe(expectedSorted[k]);
          }
        });
      }
    });
  }
});
