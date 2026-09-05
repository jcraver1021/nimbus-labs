import {type ProbeSearchAlgorithm} from '../../searchAlgorithm';

export const linearSearch: ProbeSearchAlgorithm = {
  scene: 'probe',
  name: 'Bogo Search',
  metadata: {
    timeComplexity: 'O(look I made this up * this is such a bad idea)',
  },
  skipInTests: true,
  code: `while (true) {
  i := random(array.length)
  if (array[i] === target) {
    return i;
  }
}`,
  search: async ({length, probe, markFound}, target) => {
    while (true) {
      const i = Math.floor(Math.random() * length);
      const value = await probe(i);
      if (value === target) {
        await markFound(i);
        return;
      }
    }
  },
};
