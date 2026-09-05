import {type FlatAlgorithm} from '../../../common/sortAlgorithm';

export const selectionSort: FlatAlgorithm = {
  scene: 'flat',
  name: 'Selection Sort',
  metadata: {
    timeComplexity: 'O(n²)',
  },
  code: `for (i := 0; i < length; i := i+1) {
  minIndex := i;
  for (j := i + 1; j < length; j := j+1) {
    if (array[j] < array[minIndex]) {
      minIndex := j;
    }
  }
  if (minIndex != i) {
    swap(array, i, minIndex);
  }
}`,
  sort: async ({compare, swap, length, setActiveRange, clearActiveRange}) => {
    for (let i = 0; i < length; i++) {
      await setActiveRange?.(i, length);
      let minIndex = i;
      for (let j = i + 1; j < length; j++) {
        if (await compare(minIndex, j)) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        await swap(i, minIndex);
      }
    }
    await clearActiveRange?.();
  },
};
