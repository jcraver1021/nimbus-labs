import {type SearchAlgorithm} from '../../searchAlgorithm';
import {linearSearch} from './linearSearch';
import {binarySearch} from './binarySearch';
import {quickSelect} from './quickSelect';

// All algorithms in display order; tests pick them up automatically.
export const searchAlgorithms: SearchAlgorithm[] = [
  linearSearch,
  binarySearch,
  quickSelect,
];
