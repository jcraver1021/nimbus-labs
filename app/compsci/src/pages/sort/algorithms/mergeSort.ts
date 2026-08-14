import {type MergeAlgorithm} from '../../../common/sortAlgorithm';

export const mergeSort: MergeAlgorithm = {
  scene: 'merge',
  name: 'Merge Sort',
  metadata: {
    timeComplexity: 'O(n log n)',
  },
  code: `function sort(lo, hi) {
  if (hi - lo <= 1) return;
  mid := (lo + hi) / 2;
  sort(lo, mid);
  sort(mid, hi);
  merge(lo, mid, hi);
}

function merge(lo, mid, hi) {
  aux[lo..hi] := array[lo..hi];
  i := lo; j := mid;
  for (k := lo; k < hi; k := k+1) {
    if      (i >= mid)         write(k, aux[j++]);
    else if (j >= hi)          write(k, aux[i++]);
    else if (aux[i] <= aux[j]) write(k, aux[i++]);
    else                       write(k, aux[j++]);
  }
}`,
  sort: async ({
    read,
    write,
    compare,
    setMergeRanges,
    clearMergeRanges,
    length,
  }) => {
    const aux: number[] = new Array(length);

    async function merge(lo: number, mid: number, hi: number) {
      // ── Copy phase ───────────────────────────────────────────────────────
      // Snapshot [lo, hi) into the auxiliary array. Each read briefly lifts
      // the element to show that it's being copied. No brackets yet.
      for (let k = lo; k < hi; k++) {
        aux[k] = await read(k);
      }

      // ── Collate phase ────────────────────────────────────────────────────
      // Show the two sorted halves as brackets. The left bracket [i, mid)
      // shrinks as left elements are consumed; the right bracket [j, hi)
      // shrinks as right elements are consumed.
      let i = lo;
      let j = mid;
      await setMergeRanges(i, mid, j, hi);

      for (let k = lo; k < hi; k++) {
        if (i >= mid) {
          // Left half exhausted — drain the right.
          await write(k, aux[j++]);
        } else if (j >= hi) {
          // Right half exhausted — drain the left.
          await write(k, aux[i++]);
        } else {
          // Both halves have elements: compare and pick the smaller.
          // compare() lifts i (blue) and j (teal) so the viewer can see
          // which two candidates are competing before the write happens.
          await compare(i, j);
          if (aux[i] <= aux[j]) {
            await write(k, aux[i++]);
          } else {
            await write(k, aux[j++]);
          }
        }
        // Shrink the bracket whose pointer just advanced.
        await setMergeRanges(i, mid, j, hi);
      }

      await clearMergeRanges();
    }

    async function sort(lo: number, hi: number) {
      if (hi - lo <= 1) return;
      const mid = Math.floor((lo + hi) / 2);
      await sort(lo, mid);
      await sort(mid, hi);
      await merge(lo, mid, hi);
    }

    await sort(0, length);
  },
};
