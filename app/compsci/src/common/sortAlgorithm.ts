/**
 * Operations passed to a sort algorithm. The framework handles all animation;
 * the algorithm only needs to call compare and swap.
 */
export type SortOps = {
  /**
   * Returns true if arr[i] > arr[j].
   * Highlights and lifts both elements for the duration of comparison.
   * If a different pair was previously active, it is lowered first.
   */
  compare: (i: number, j: number) => Promise<boolean>;

  /**
   * Visually swaps arr[i] and arr[j].
   * If the pair is already risen from a compare call, the slide begins
   * immediately. Otherwise, the pair is risen first.
   */
  swap: (i: number, j: number) => Promise<void>;

  /** Number of elements in the array. */
  readonly length: number;
};

export type AlgorithmMetadata = {
  timeComplexity: string;
};

export type SortAlgorithm = {
  name: string;
  metadata: AlgorithmMetadata;
  /** Source code shown to the viewer alongside the visualization. */
  code: string;
  sort: (ops: SortOps) => Promise<void>;
};
