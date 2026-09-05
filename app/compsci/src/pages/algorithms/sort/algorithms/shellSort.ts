import {type FlatAlgorithm} from '../../sortAlgorithm';

export const shellSort: FlatAlgorithm = {
  scene: 'flat',
  name: 'Shell Sort',
  metadata: {
    timeComplexity: 'O(n log² n)',
  },
  code: `gap := length / 2;
while (gap > 0) {
  for (i := gap; i < length; i := i+1) {
    j := i;
    while (j >= gap && array[j - gap] > array[j]) {
      swap(array, j - gap, j);
      j := j - gap;
    }
  }
  gap := gap / 2;
}`,
  sort: async ({compare, swap, length, setActiveRange, clearActiveRange}) => {
    let gap = Math.floor(length / 2);
    while (gap > 0) {
      for (let i = gap; i < length; i++) {
        await setActiveRange?.(i, length);
        let j = i;
        while (j >= gap && (await compare(j - gap, j))) {
          await swap(j - gap, j);
          j -= gap;
        }
      }
      gap = Math.floor(gap / 2);
    }
    await clearActiveRange?.();
  },
};
