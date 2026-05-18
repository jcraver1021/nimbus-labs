/**
 * Deep Time - Framework-agnostic model for representing graphical relationships over geologic time
 */

export {
  createTemporalGraph,
  addNode,
  addEdge,
  getLineage,
  findCommonAncestor,
  getNodesAtTime,
  getDescendants,
  getDivergenceTime,
  isTimeRange,
  getTimeValue,
  getTimeMin,
  getTimeMax,
  timeIntersects,
  type TimePoint,
  type TimeRange,
  type TemporalNode,
  type TemporalEdge,
  type TemporalGraph,
  type GeologicPeriod,
} from './temporal-graph';

export {
  GEOLOGIC_PERIODS,
  getPeriodAtTime,
  getPeriodsInRange,
  getPeriodsByLevel,
  getEons,
  getEras,
  getPeriods,
  getEpochs,
  getAges,
  formatTimeYearsAgo,
} from './geologic-time-scale';
