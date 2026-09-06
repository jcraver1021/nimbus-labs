import {type SearchAlgorithm} from '../../searchAlgorithm';
import {binarySearch} from './binarySearch';
import {bogoSearch} from './bogoSearch';
import {linearSearch} from './linearSearch';
import {quickSelect} from './quickSelect';
import {quickSelectRandomPivot} from './quickSelectRandomPivot';

/**
 * All algorithms in display order; tests pick them up automatically.
 */
export const searchAlgorithms: SearchAlgorithm[] = [
  linearSearch,
  binarySearch,
  quickSelect,
  quickSelectRandomPivot,
  bogoSearch,
];
