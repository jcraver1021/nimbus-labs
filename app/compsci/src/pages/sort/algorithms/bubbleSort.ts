import {type FlatAlgorithm} from '../../../common/sortAlgorithm';

export const bubbleSort: FlatAlgorithm = {
  scene: 'flat',
  name: 'Bubble Sort',
  metadata: {
    timeComplexity: 'O(n²)',
  },
  code: `for (i := 0; i < length; i := i+1) {
  for (j := 0; j < length - i - 1; j := j+1) {
    if (array[j] > array[j + 1]) {
      swap(array, j, j + 1);
    }
  }
}`,
  sort: async ({compare, swap, length, setActiveRange, clearActiveRange}) => {
    for (let i = 0; i < length; i++) {
      await setActiveRange?.(0, length - i);
      for (let j = 0; j < length - i - 1; j++) {
        if (await compare(j, j + 1)) {
          await swap(j, j + 1);
        }
      }
    }
    await clearActiveRange?.();
  },
};
