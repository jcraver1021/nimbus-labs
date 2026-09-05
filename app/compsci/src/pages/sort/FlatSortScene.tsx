import {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import {type DatumEntry, CELL_WIDTH, CELL_PADDING} from '../../common/datum';
import {type Selection} from '../../common/selection';
import {type FlatAlgorithm} from '../../common/sortAlgorithm';
import {
  DEFAULT_ANIMATION_CONFIG,
  scaleAnimation,
} from '../../common/animationConfig';
import Array from '../../components/array/Array';

type Props = {
  algorithm: FlatAlgorithm;
  /** Current entries from the parent. Changing this resets animation state. */
  entries: DatumEntry[];
  /** Called with the final sorted array when the sort completes. */
  onEntriesChange: (entries: DatumEntry[]) => void;
  speed: number;
  /** Increment to trigger a new sort. 0 = no sort on mount. */
  sortKey: number;
  abortRef: React.RefObject<boolean>;
  onSortEnd: () => void;
};

function slotsFromEntries(entries: DatumEntry[]): Map<number, number> {
  return new Map(entries.map((e, i) => [e.id, i]));
}

export default function FlatSortScene({
  algorithm,
  entries,
  onEntriesChange,
  speed,
  sortKey,
  abortRef,
  onSortEnd,
}: Props) {
  const [slots, setSlots] = useState<Map<number, number>>(() =>
    slotsFromEntries(entries)
  );
  const [lifted, setLifted] = useState<Set<number>>(new Set());
  const [states, setStates] = useState<Map<number, Selection>>(new Map());
  const [activeRange, setActiveRangeState] = useState<[number, number] | null>(
    null
  );

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  });

  // Run the sort whenever sortKey is incremented.
  useEffect(() => {
    if (sortKey === 0) return;

    const arr = [...entries];
    const slotMap = slotsFromEntries(arr);

    const delay = (ms: number) =>
      new Promise<void>(resolve => {
        if (abortRef.current) {
          resolve();
          return;
        }
        const scaled = Math.round(ms / speedRef.current);
        const id = setTimeout(resolve, scaled);
        const poll = setInterval(() => {
          if (abortRef.current) {
            clearTimeout(id);
            clearInterval(poll);
            resolve();
          }
        }, 16);
        setTimeout(() => clearInterval(poll), scaled + 1);
      });

    let activeI: number | null = null;
    let activeJ: number | null = null;

    const rise = async (i: number, j: number) => {
      const idA = arr[i].id;
      const idB = arr[j].id;
      setLifted(new Set([idA, idB]));
      setStates(prev => {
        const next = new Map(prev);
        next.set(idA, 'selected');
        next.set(idB, 'selected');
        return next;
      });
      activeI = i;
      activeJ = j;
      await delay(DEFAULT_ANIMATION_CONFIG.riseDuration);
    };

    const lower = async () => {
      setLifted(new Set());
      // Only clear 'selected'; 'sorted' markers accumulated by markSorted
      // stay in place for the rest of the sort.
      setStates(prev => {
        const next = new Map(prev);
        for (const [id, state] of prev) {
          if (state === 'selected') next.delete(id);
        }
        return next;
      });
      activeI = null;
      activeJ = null;
      await delay(DEFAULT_ANIMATION_CONFIG.lowerDuration);
    };

    const ensureRisen = async (i: number, j: number) => {
      if (activeI === i && activeJ === j) return;
      if (activeI !== null) await lower();
      await rise(i, j);
    };

    const ops = {
      length: arr.length,

      setActiveRange: async (lo: number, hi: number) => {
        setActiveRangeState([lo, hi]);
      },

      clearActiveRange: async () => {
        setActiveRangeState(null);
      },

      markSorted: async (index: number) => {
        const id = arr[index].id;
        setStates(prev => new Map(prev).set(id, 'sorted'));
      },

      compare: async (i: number, j: number) => {
        if (abortRef.current) return false;
        await ensureRisen(i, j);
        return abortRef.current ? false : arr[i].value > arr[j].value;
      },

      swap: async (i: number, j: number) => {
        if (abortRef.current) return;
        await ensureRisen(i, j);
        if (abortRef.current) return;

        const idA = arr[i].id;
        const idB = arr[j].id;
        const animSlots = new Map(slotMap);
        animSlots.set(idA, j);
        animSlots.set(idB, i);
        setSlots(animSlots);
        await delay(DEFAULT_ANIMATION_CONFIG.slideDuration);

        [arr[i], arr[j]] = [arr[j], arr[i]];
        slotMap.set(idA, j);
        slotMap.set(idB, i);

        await lower();
      },
    };

    const run = async () => {
      // Discard any 'sorted' markers left over from a previous run on this
      // same array — they don't reflect this run's progress and would
      // otherwise get clobbered mid-compare (see rise/lower above).
      setStates(new Map());

      await algorithm.sort(ops);

      if (activeI !== null) {
        setLifted(new Set());
      }
      setActiveRangeState(null);
      // Mark everything as sorted on completion.
      setStates(new Map(arr.map(e => [e.id, 'sorted'])));

      onEntriesChange([...arr]);
      setSlots(slotsFromEntries(arr));

      if (!abortRef.current) {
        onSortEnd();
      }
    };

    run();
    // sortKey is the only intended trigger; other deps are stable refs or don't change mid-sort.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey]);

  const animConfig = scaleAnimation(DEFAULT_ANIMATION_CONFIG, speed);
  const rangeLeft =
    activeRange != null ? activeRange[0] * CELL_WIDTH + CELL_PADDING : 0;
  const rangeWidth =
    activeRange != null ? (activeRange[1] - activeRange[0]) * CELL_WIDTH : 0;

  return (
    <Box sx={{position: 'relative', display: 'inline-block'}}>
      <Array
        entries={entries}
        slots={slots}
        lifted={lifted}
        states={states}
        transitionMs={animConfig.slideDuration}
      />
      {activeRange != null && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -6,
            left: rangeLeft,
            width: rangeWidth,
            height: 4,
            backgroundColor: 'primary.main',
            borderRadius: 1,
            transition: 'left 150ms ease, width 150ms ease',
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
}
