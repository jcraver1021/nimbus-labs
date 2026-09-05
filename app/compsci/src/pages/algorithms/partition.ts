import {type QuickOps} from './sortAlgorithm';

type CompareOnly = Pick<QuickOps, 'compare'>;

/**
 * Picks which index in [low, high] to use as the pivot, before it's swapped
 * into position `high` for the Lomuto scan. May be async (e.g. median-of-
 * three needs to compare elements, which is itself visualized).
 */
export type PivotStrategy = (
  ops: CompareOnly,
  low: number,
  high: number
) => number | Promise<number>;

/**
 * Finds which of low/mid/high holds the median value, using only pairwise
 * ">" comparisons (the same primitive the partition scan itself uses, so
 * the choice is visualized the same way as any other comparison).
 */
async function medianOfThreeIndex(
  compare: CompareOnly['compare'],
  low: number,
  mid: number,
  high: number
): Promise<number> {
  const lowGtMid = await compare(low, mid);
  const midGtHigh = await compare(mid, high);
  const lowGtHigh = await compare(low, high);

  if (lowGtMid) {
    return midGtHigh ? mid : lowGtHigh ? high : low;
  }
  return lowGtHigh ? low : midGtHigh ? high : mid;
}

/**
 * Deterministic pivot strategy: the median of the range's first, middle,
 * and last elements. Three comparisons, no randomness — cheaply defeats the
 * already-sorted/reverse-sorted inputs that make "always pick the last
 * element" degenerate to O(n^2), but a party who knows this exact strategy
 * could in principle still construct an adversarial input for it.
 */
export async function chooseMedianOfThreePivot(
  ops: CompareOnly,
  low: number,
  high: number
): Promise<number> {
  if (high - low < 2) return high;
  const mid = low + Math.floor((high - low) / 2);
  return medianOfThreeIndex(ops.compare, low, mid, high);
}

/**
 * Randomized pivot strategy: a uniformly random index in [low, high]. No
 * comparisons needed to choose it, and — unlike any fixed deterministic
 * strategy — its worst case can't be targeted by a specific input pattern;
 * every input degrades to O(n^2) with the same (vanishingly small)
 * probability. The tradeoff is losing determinism: two runs on the same
 * array can partition differently.
 */
export function chooseRandomPivot(
  _ops: CompareOnly,
  low: number,
  high: number
): number {
  return low + Math.floor(Math.random() * (high - low + 1));
}

/**
 * Lomuto partition: places the chosen pivot into its final sorted position,
 * with everything <= pivot to its left. Returns the pivot's resting index.
 * Shared by quicksort (which recurses into both sides) and quickselect
 * (which recurses into only the side containing the target rank) — the
 * partition step itself is identical for both, and for every pivot
 * strategy.
 */
export async function partitionLomuto(
  ops: Pick<
    QuickOps,
    'compare' | 'swap' | 'setPivot' | 'clearPivot' | 'markSorted'
  >,
  low: number,
  high: number,
  choosePivot: PivotStrategy = chooseMedianOfThreePivot
): Promise<number> {
  const {compare, swap, setPivot, clearPivot, markSorted} = ops;

  const pivotIndex = await choosePivot(ops, low, high);
  if (pivotIndex !== high) {
    await swap(pivotIndex, high);
  }

  await setPivot(high);
  const pivot = high;
  let i = low;
  for (let j = low; j < high; j++) {
    if (await compare(pivot, j)) {
      await swap(i, j);
      i++;
    }
  }
  await swap(i, high);
  await clearPivot();
  await markSorted(i);
  return i;
}
