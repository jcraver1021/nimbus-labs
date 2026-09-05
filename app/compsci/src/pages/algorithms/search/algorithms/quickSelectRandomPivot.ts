import {type QuickSelectAlgorithm} from '../../searchAlgorithm';
import {partitionLomuto, chooseRandomPivot} from '../../partition';

export const quickSelectRandomPivot: QuickSelectAlgorithm = {
  scene: 'quickselect',
  name: 'Quickselect (Random Pivot)',
  metadata: {
    timeComplexity: 'O(n) expected',
  },
  code: `function quickSelect(array, low, high, k) {
  if (low === high) return low;
  const pi = partition(array, low, high); // random pivot
  if (pi === k) return pi;
  if (k < pi) return quickSelect(array, low, pi - 1, k);
  return quickSelect(array, pi + 1, high, k);
}`,
  search: async (ops, k) => {
    const {length, setActiveRange, clearActiveRange, markSorted} = ops;
    const target = Math.min(Math.max(k, 0), Math.max(length - 1, 0));

    const quickSelectRecursive = async (
      low: number,
      high: number
    ): Promise<void> => {
      if (low === high) {
        await markSorted(low);
        return;
      }
      await setActiveRange(low, high + 1);
      const pi = await partitionLomuto(ops, low, high, chooseRandomPivot);
      if (pi === target) return;
      if (target < pi) {
        await quickSelectRecursive(low, pi - 1);
      } else {
        await quickSelectRecursive(pi + 1, high);
      }
    };

    if (length > 0) {
      await quickSelectRecursive(0, length - 1);
    }
    await clearActiveRange();
  },
};
