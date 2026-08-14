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
    if      (i >= mid)        write(k, aux[j++]);
    else if (j >= hi)         write(k, aux[i++]);
    else if (aux[i] <= aux[j]) write(k, aux[i++]);
    else                      write(k, aux[j++]);
  }
}`,
  sort: async ({read, write, setActiveRange, clearActiveRange, length}) => {
    const aux: number[] = new Array(length);

    async function merge(lo: number, mid: number, hi: number) {
      await setActiveRange(lo, hi);

      // Copy [lo, hi) into auxiliary array.
      for (let k = lo; k < hi; k++) {
        aux[k] = await read(k);
      }

      let i = lo;
      let j = mid;
      for (let k = lo; k < hi; k++) {
        if (i >= mid) {
          await write(k, aux[j++]);
        } else if (j >= hi) {
          await write(k, aux[i++]);
        } else if (aux[i] <= aux[j]) {
          await write(k, aux[i++]);
        } else {
          await write(k, aux[j++]);
        }
      }

      await clearActiveRange();
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
