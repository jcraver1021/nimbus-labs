import {type Algorithm} from '../../../common/sortAlgorithm';
import {bubbleSort} from './bubbleSort';
import {heapSort} from './heapSort';
import {iCantBelieveItCanSort} from './iCantBelieveItCanSort';
import {insertionSort} from './insertionSort';
import {mergeSort} from './mergeSort';
import {quickSort} from './quickSort';
import {selectionSort} from './selectionSort';

// All algorithms in display order; tests pick them up automatically.
export const algorithms: Algorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  iCantBelieveItCanSort,
  mergeSort,
  heapSort,
  quickSort,
];
