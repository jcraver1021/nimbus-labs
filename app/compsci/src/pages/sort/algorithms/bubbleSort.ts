import {type FlatAlgorithm} from '../../../common/sortAlgorithm';

export const bubbleSort: FlatAlgorithm = {
  scene: 'flat',
  name: 'Bubble Sort',
  metadata: {
    timeComplexity: 'O(n²)',
  },
  code: `let n = length;
while (n > 1) {
  let lastSwap = -1;
  for (let i = 0; i < n - 1; i++) {
    if (array[i] > array[i + 1]) {
      swap(array, i, i + 1);
      lastSwap = i;
    }
  }
  n = lastSwap + 1;
}`,
  sort: async ({
    compare,
    swap,
    length,
    setActiveRange,
    clearActiveRange,
    markSorted,
  }) => {
    let n = length;
    while (n > 1) {
      await setActiveRange?.(0, n);
      let lastSwap = -1;
      for (let i = 0; i < n - 1; i++) {
        if (await compare(i, i + 1)) {
          await swap(i, i + 1);
          lastSwap = i;
        }
      }
      const newN = lastSwap + 1;
      for (let k = newN; k < n; k++) {
        await markSorted?.(k);
      }
      n = newN;
    }
    if (n === 1) {
      await markSorted?.(0);
    }
    await clearActiveRange?.();
  },
};
