import {type FlatAlgorithm} from '../../../common/sortAlgorithm';

export const iCantBelieveItCanSort: FlatAlgorithm = {
  scene: 'flat',
  name: "I Can't Believe It Can Sort",
  metadata: {
    timeComplexity: 'O(n²)',
  },
  code: `for (i := 0; i < length; i := i+1) {
  for (j := 0; j < length; j := j+1) {
    if array[i] < array[j] {
      swap(array, i, j);
    }
  }
}`,
  sort: async ({compare, swap, length}) => {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (await compare(j, i)) {
          await swap(i, j);
        }
      }
    }
  },
};
