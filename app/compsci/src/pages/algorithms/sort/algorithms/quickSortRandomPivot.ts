import {type QuickAlgorithm} from '../../sortAlgorithm';
import {partitionLomuto, chooseRandomPivot} from '../../partition';

export const quickSortRandomPivot: QuickAlgorithm = {
  scene: 'quick',
  name: 'Quick Sort (Random Pivot)',
  metadata: {
    timeComplexity: 'O(n log n) expected',
  },
  code: `function quickSort(array, low, high) {
  if (low < high) {
    const pi = partition(array, low, high);
    quickSort(array, low, pi - 1);
    quickSort(array, pi + 1, high);
  } else if (low === high) {
    markSorted(low);
  }
}

function partition(array, low, high) {
  // Pick a uniformly random pivot instead of always array[high] — no input
  // pattern can be constructed in advance to trigger the worst case.
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  [array[randomIndex], array[high]] = [array[high], array[randomIndex]];

  const pivot = array[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      [array[i], array[j]] = [array[j], array[i]];
      i++;
    }
  }
  [array[i], array[high]] = [array[high], array[i]];
  markSorted(i);
  return i;
}`,
  sort: async ops => {
    const {length, setActiveRange, clearActiveRange, markSorted} = ops;

    const quickSortRecursive = async (
      low: number,
      high: number
    ): Promise<void> => {
      if (low < high) {
        await setActiveRange(low, high + 1);
        const pi = await partitionLomuto(ops, low, high, chooseRandomPivot);
        await quickSortRecursive(low, pi - 1);
        await quickSortRecursive(pi + 1, high);
      } else if (low === high) {
        await markSorted(low);
      }
    };

    await quickSortRecursive(0, length - 1);
    await clearActiveRange();
  },
};
