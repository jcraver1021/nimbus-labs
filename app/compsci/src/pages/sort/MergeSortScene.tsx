import {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import {type DatumEntry, CELL_WIDTH, CELL_PADDING} from '../../common/datum';
import {type Selection} from '../../common/selection';
import {type MergeAlgorithm} from '../../common/sortAlgorithm';
import {
  DEFAULT_ANIMATION_CONFIG,
  scaleAnimation,
} from '../../common/animationConfig';
import Array from '../../components/array/Array';

type Props = {
  algorithm: MergeAlgorithm;
  entries: DatumEntry[];
  onEntriesChange: (entries: DatumEntry[]) => void;
  speed: number;
  sortKey: number;
  abortRef: React.RefObject<boolean>;
  onSortEnd: () => void;
};

function slotsFromEntries(entries: DatumEntry[]): Map<number, number> {
  return new Map(entries.map((e, i) => [e.id, i]));
}

export default function MergeSortScene({
  algorithm,
  entries,
  onEntriesChange,
  speed,
  sortKey,
  abortRef,
  onSortEnd,
}: Props) {
  // In merge sort elements don't move — only their values change.
  // We keep a local copy of entries so we can update values mid-sort.
  const [displayEntries, setDisplayEntries] = useState<DatumEntry[]>(entries);
  const [lifted, setLifted] = useState<Set<number>>(new Set());
  const [states, setStates] = useState<Map<number, Selection>>(new Map());
  const [activeRange, setActiveRangeState] = useState<[number, number] | null>(
    null
  );

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  });

  useEffect(() => {
    if (sortKey === 0) return;

    // Local mutable array — same ids, mutable values.
    // Elements never move in merge sort; only values change.
    const arr: DatumEntry[] = entries.map(e => ({...e}));

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

    const ops = {
      length: arr.length,

      read: async (i: number) => {
        if (abortRef.current) return arr[i].value;
        const entryId = arr[i].id;
        setLifted(new Set([entryId]));
        setStates(new Map([[entryId, 'selected']]));
        await delay(DEFAULT_ANIMATION_CONFIG.riseDuration);
        setLifted(new Set());
        setStates(new Map());
        return arr[i].value;
      },

      write: async (i: number, value: number) => {
        if (abortRef.current) return;
        arr[i] = {...arr[i], value};
        setDisplayEntries([...arr]);
        setLifted(new Set([arr[i].id]));
        setStates(new Map([[arr[i].id, 'selected']]));
        await delay(DEFAULT_ANIMATION_CONFIG.slideDuration);
        setLifted(new Set());
        setStates(new Map());
      },

      setActiveRange: async (lo: number, hi: number) => {
        setActiveRangeState([lo, hi]);
        await delay(DEFAULT_ANIMATION_CONFIG.lowerDuration);
      },

      clearActiveRange: async () => {
        setActiveRangeState(null);
        await delay(DEFAULT_ANIMATION_CONFIG.lowerDuration);
      },
    };

    const run = async () => {
      await algorithm.sort(ops);

      setLifted(new Set());
      setStates(new Map());
      setActiveRangeState(null);

      onEntriesChange([...arr]);

      if (!abortRef.current) {
        onSortEnd();
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey]);

  const animConfig = scaleAnimation(DEFAULT_ANIMATION_CONFIG, speed);
  const slots = slotsFromEntries(displayEntries);
  const rangeLeft =
    activeRange != null ? activeRange[0] * CELL_WIDTH + CELL_PADDING : 0;
  const rangeWidth =
    activeRange != null ? (activeRange[1] - activeRange[0]) * CELL_WIDTH : 0;

  return (
    <Box sx={{position: 'relative', display: 'inline-block'}}>
      <Array
        entries={displayEntries}
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
