import {type FlatAlgorithm} from '../../../common/sortAlgorithm';

export const bogoSort: FlatAlgorithm = {
  scene: 'flat',
  name: 'Bogo Sort',
  metadata: {
    timeComplexity: 'O(stop it * how dare you)',
  },
  skipInTests: true,
  code: `function bogoSort(array) {
  while (notSorted(array)) {
    shuffle(array);
  }
}

function notSorted(array) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) {
      return true;
    }
  }
  return false;
}

function shuffle(array) {
  // At least it's a Fisher-Yates shuffle...
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}`,
  sort: async ({compare, swap, length}) => {
    async function notSorted() {
      for (let i = 0; i < length - 1; i++) {
        if (await compare(i, i + 1)) {
          return true;
        }
      }
      return false;
    }

    async function shuffle() {
      for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        await swap(i, j);
      }
    }

    while (await notSorted()) {
      await shuffle();
    }
  },
};
