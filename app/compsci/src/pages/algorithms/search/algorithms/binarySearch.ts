import {type ProbeSearchAlgorithm} from '../../searchAlgorithm';

export const binarySearch: ProbeSearchAlgorithm = {
  scene: 'probe',
  name: 'Binary Search',
  metadata: {
    timeComplexity: 'O(log n)',
  },
  code: `let lo = 0, hi = length - 1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (array[mid] === target) return mid;
  if (array[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;`,
  search: async (
    {length, probe, setActiveRange, clearActiveRange, markFound},
    target
  ) => {
    let lo = 0;
    let hi = length - 1;
    while (lo <= hi) {
      await setActiveRange?.(lo, hi + 1);
      const mid = Math.floor((lo + hi) / 2);
      const value = await probe(mid);
      if (value === target) {
        await markFound(mid);
        break;
      }
      if (value < target) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    await clearActiveRange?.();
  },
};
