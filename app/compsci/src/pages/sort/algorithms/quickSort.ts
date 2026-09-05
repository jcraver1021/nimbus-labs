import {type QuickAlgorithm} from '../../../common/sortAlgorithm';

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
  sort: async ({
    length,
    compare,
    swap,
    setActiveRange,
    clearActiveRange,
    setPivot,
    clearPivot,
    markSorted,
  }) => {
    const partition = async (low: number, high: number): Promise<number> => {
      await setPivot(high);
      const pivot = high;
      let i = low;
      for (let j = low; j < high; j++) {
        if (await compare(pivot, j)) {
          await swap(i, j);
          i++;
        }
      }
      await swap(i, high);
      await clearPivot();
      await markSorted(i);
      return i;
    };

    const quickSortRecursive = async (
      low: number,
      high: number
    ): Promise<void> => {
      if (low < high) {
        await setActiveRange(low, high + 1);
        const pi = await partition(low, high);
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
