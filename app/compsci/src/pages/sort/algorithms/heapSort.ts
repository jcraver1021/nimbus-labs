import {type HeapAlgorithm} from '../../../common/sortAlgorithm';

export const heapSort: HeapAlgorithm = {
  scene: 'heap',
  name: 'Heap Sort',
  metadata: {
    timeComplexity: 'O(n log n)',
  },
  code: `// Build max-heap
for (i := n/2 - 1; i >= 0; i := i-1) {
  siftDown(i, n);
}
// Extract elements largest-first
for (end := n-1; end > 0; end := end-1) {
  swap(0, end);
  setHeapSize(end);
  siftDown(0, end);
}

function siftDown(root, heapSize) {
  while (true) {
    largest := root;
    left := 2*root + 1; right := 2*root + 2;
    if (left  < heapSize && array[left]  > array[largest]) largest := left;
    if (right < heapSize && array[right] > array[largest]) largest := right;
    if (largest == root) break;
    swap(root, largest);
    root := largest;
  }
}`,
  sort: async ({compare, swap, setHeapSize, length}) => {
    async function siftDown(root: number, heapSize: number) {
      while (true) {
        const left = 2 * root + 1;
        const right = 2 * root + 2;
        let largest = root;
        if (left < heapSize && (await compare(left, largest))) largest = left;
        if (right < heapSize && (await compare(right, largest)))
          largest = right;
        if (largest === root) break;
        await swap(root, largest);
        root = largest;
      }
    }

    // Build max-heap.
    for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
      await siftDown(i, length);
    }

    // Extract elements one by one.
    for (let end = length - 1; end > 0; end--) {
      await swap(0, end);
      await setHeapSize(end);
      await siftDown(0, end);
    }
  },
};
