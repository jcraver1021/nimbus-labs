import {type QuickOps} from './sortAlgorithm';

/**
 * Lomuto partition: places array[high] (the pivot) into its final sorted
 * position, with everything <= pivot to its left. Returns the pivot's
 * resting index. Shared by quicksort (which recurses into both sides) and
 * quickselect (which recurses into only the side containing the target
 * rank) — the partition step itself is identical for both.
 */
export async function partitionLomuto(
  ops: Pick<
    QuickOps,
    'compare' | 'swap' | 'setPivot' | 'clearPivot' | 'markSorted'
  >,
  low: number,
  high: number
): Promise<number> {
  const {compare, swap, setPivot, clearPivot, markSorted} = ops;

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
