import {type SortAlgorithm} from '../../../common/sortAlgorithm';

export const insertionSort: SortAlgorithm = {
  name: 'Insertion Sort',
  metadata: {
    timeComplexity: 'O(n²)',
  },
  code: `for (i := 1; i < length; i := i+1) {
  j := i;
  while (j > 0 && array[j - 1] > array[j]) {
    swap(array, j - 1, j);
    j := j-1;
  }
}`,
  sort: async ({compare, swap, length}) => {
    for (let i = 1; i < length; i++) {
      let j = i;
      while (j > 0 && (await compare(j - 1, j))) {
        await swap(j - 1, j);
        j--;
      }
    }
  },
};
