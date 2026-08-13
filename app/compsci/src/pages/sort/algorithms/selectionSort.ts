import {type SortAlgorithm} from '../../../common/sortAlgorithm';

export const selectionSort: SortAlgorithm = {
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
  sort: async ({compare, swap, length}) => {
    for (let i = 0; i < length; i++) {
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
  },
};
