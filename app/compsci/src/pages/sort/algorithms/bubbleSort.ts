import {type SortAlgorithm} from '../../../common/sortAlgorithm';

export const bubbleSort: SortAlgorithm = {
  name: 'Bubble Sort',
  metadata: {
    timeComplexity: 'O(n²)',
  },
  code: `for (let i = 0; i < length; i++) {
  for (let j = 0; j < length - i - 1; j++) {
    if (await compare(j, j + 1)) {
      await swap(j, j + 1);
    }
  }
}`,
  sort: async ({compare, swap, length}) => {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length - i - 1; j++) {
        if (await compare(j, j + 1)) {
          await swap(j, j + 1);
        }
      }
    }
  },
};
