import {type Algorithm} from '../../sortAlgorithm';
import {bogoSort} from './bogoSort';
import {bubbleSort} from './bubbleSort';
import {heapSort} from './heapSort';
import {iCantBelieveItCanSort} from './iCantBelieveItCanSort';
import {insertionSort} from './insertionSort';
import {mergeSort} from './mergeSort';
import {quickSort} from './quickSort';
import {selectionSort} from './selectionSort';
import {shellSort} from './shellSort';

// All algorithms in display order; tests pick them up automatically.
export const algorithms: Algorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  shellSort,
  iCantBelieveItCanSort,
  mergeSort,
  heapSort,
  quickSort,
  bogoSort,
];
