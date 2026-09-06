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
  skipInTests?: boolean; // Skip this algorithm in the correctness test suite, for algorithms whose expected running time makes them unfit for automated testing (e.g. bogo sort's O((n+1)!) expected shuffles); still shown and runnable in the UI.
};
