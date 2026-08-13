import {type SortAlgorithm} from '../../../common/sortAlgorithm';
import {bubbleSort} from './bubbleSort';
import {insertionSort} from './insertionSort';
import {selectionSort} from './selectionSort';

// list of all implemented sorting algorithms (in display order)
// the tester will pick them up automatically
export const algorithms: SortAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
];
