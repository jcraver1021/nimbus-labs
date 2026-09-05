import {type FlatAlgorithm} from '../../sortAlgorithm';

export const bogoSort: FlatAlgorithm = {
  scene: 'flat',
  name: 'Bogo Sort',
  metadata: {
    timeComplexity: 'O(stop it * how dare you)',
  },
  skipInTests: true,
  code: `while (notSorted(array)) {
    shuffle(array);
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
