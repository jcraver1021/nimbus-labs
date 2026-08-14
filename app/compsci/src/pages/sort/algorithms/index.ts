import {type Algorithm} from '../../../common/sortAlgorithm';
import {bubbleSort} from './bubbleSort';
import {insertionSort} from './insertionSort';
import {selectionSort} from './selectionSort';
import {mergeSort} from './mergeSort';
import {heapSort} from './heapSort';

// All algorithms in display order; tests pick them up automatically.
export const algorithms: Algorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  heapSort,
];
