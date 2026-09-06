/**
 * Shared shape for any algorithm visualization — sort, search, and (in the
 * future) data-structure operations alike. Domain-specific `*Algorithm`
 * unions (see pages/algorithms/sortAlgorithm.ts, searchAlgorithm.ts) extend
 * this with their own `scene` discriminant and execution method.
 */
export type AlgorithmMetadata = {
  timeComplexity: string;
};

export type AlgorithmBase = {
  name: string;
  metadata: AlgorithmMetadata;
  code: string; // Source code shown to the viewer alongside the visualization.
  skipInTests?: boolean; // Skip this algorithm in the correctness test suite. Useful for algorithms with unreasonable expected running times.
};
