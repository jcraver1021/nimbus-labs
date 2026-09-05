import {type ProbeSearchAlgorithm} from '../../searchAlgorithm';

export const linearSearch: ProbeSearchAlgorithm = {
  scene: 'probe',
  name: 'Linear Search',
  metadata: {
    timeComplexity: 'O(n)',
  },
  code: `for (let i = 0; i < length; i++) {
  if (array[i] === target) {
    return i;
  }
}
return -1;`,
  search: async ({length, probe, markFound}, target) => {
    for (let i = 0; i < length; i++) {
      const value = await probe(i);
      if (value === target) {
        await markFound(i);
        return;
      }
    }
  },
};
