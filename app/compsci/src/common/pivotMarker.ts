import {useState} from 'react';
import {type Selection} from './selection';

/**
 * Tracks a single "pivot" marker by element id (not index): the pivot's
 * index doesn't move during a partition, but capturing the id lets the
 * marker keep following the right element if that ever changes. Shared by
 * quicksort and quickselect, whose partition step is identical.
 */
export function usePivotMarker() {
  const [pivotId, setPivotId] = useState<number | null>(null);

  return {
    pivotId,
    setPivot: async (arr: {id: number}[], index: number) => {
      setPivotId(arr[index].id);
    },
    clearPivot: async () => {
      setPivotId(null);
    },
    reset: () => setPivotId(null),
  };
}

/**
 * Layers the pivot marker into a states map for rendering. Falls back in
 * behind any live 'selected'/'sorted' state for the same element, so a
 * mid-partition comparison flash (or the final "landed" color) always takes
 * visual priority over the pivot marker.
 */
export function withPivotOverlay(
  states: Map<number, Selection>,
  pivotId: number | null
): Map<number, Selection> {
  if (pivotId == null || states.has(pivotId)) return states;
  const next = new Map(states);
  next.set(pivotId, 'pivot');
  return next;
}
