import {type SortAlgorithm} from '../../../common/sortAlgorithm';
import {bubbleSort} from './bubbleSort';
import {insertionSort} from './insertionSort';
import {selectionSort} from './selectionSort';

// Add new algorithms here — they will appear automatically in the selector.
export const algorithms: SortAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
];
