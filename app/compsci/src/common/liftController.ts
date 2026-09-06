import {type Selection} from './selection';

type SetLifted = React.Dispatch<React.SetStateAction<Set<number>>>;
type SetStates = React.Dispatch<React.SetStateAction<Map<number, Selection>>>;

export type LiftController = {
  ensureRisen: (ids: number[]) => Promise<void>; // Rises (lifts + highlights 'selected') the given element ids, lowering whatever was previously risen first if it differs; no-op if the same ids are already risen, letting a `compare` immediately followed by a `swap` on the same pair skip a redundant lower/rise.
  lower: () => Promise<void>; // Lowers whatever is currently risen.
  isRisen: () => boolean; // True if anything is currently risen.
};

/**
 * Shared "lift elements, highlight them, wait, lower them" animation used by
 * every compare/probe-driven scene. `ids` is a pair (`[i, j]`) for two-element
 * comparisons (sorting, quickselect's partition) or a singleton (`[i]`) for
 * single-element probes (linear/binary search).
 */
export function createLiftController(
  setLifted: SetLifted,
  setStates: SetStates,
  delay: (ms: number) => Promise<void>,
  riseDuration: number,
  lowerDuration: number
): LiftController {
  let activeIds: number[] | null = null;

  const sameIds = (a: number[], b: number[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const rise = async (ids: number[]) => {
    setLifted(new Set(ids));
    setStates(prev => {
      const next = new Map(prev);
      for (const id of ids) next.set(id, 'selected');
      return next;
    });
    activeIds = ids;
    await delay(riseDuration);
  };

  const lower = async () => {
    setLifted(new Set());
    // Only clear 'selected'; other markers (e.g. 'sorted') accumulated
    // elsewhere stay in place for the rest of the run.
    setStates(prev => {
      const next = new Map(prev);
      for (const [id, state] of prev) {
        if (state === 'selected') next.delete(id);
      }
      return next;
    });
    activeIds = null;
    await delay(lowerDuration);
  };

  const ensureRisen = async (ids: number[]) => {
    if (activeIds !== null && sameIds(activeIds, ids)) return;
    if (activeIds !== null) await lower();
    await rise(ids);
  };

  return {ensureRisen, lower, isRisen: () => activeIds !== null};
}
