import {type QuickAlgorithm} from '../../sortAlgorithm';
import {partitionLomuto} from '../../partition';

export const quickSort: QuickAlgorithm = {
  scene: 'quick',
  name: 'Quick Sort',
  metadata: {
    timeComplexity: 'O(n log n)',
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
  // Move the median of the first, middle, and last elements to the end
  // so it's used as the pivot — avoids O(n^2) on sorted/reverse-sorted input.
  const mid = low + Math.floor((high - low) / 2);
  const medianIndex = medianOfThree(array, low, mid, high);
  [array[medianIndex], array[high]] = [array[high], array[medianIndex]];

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
        const pi = await partitionLomuto(ops, low, high);
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
