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
  // Two brackets shown below the array during the merge (collate) phase:
  //   leftRange  [i, mid)  — remaining elements in the left half  (blue)
  //   rightRange [j, hi)   — remaining elements in the right half (teal)
  const [leftRange, setLeftRange] = useState<[number, number] | null>(null);
  const [rightRange, setRightRange] = useState<[number, number] | null>(null);

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

      // Lifts the left candidate (blue) and right candidate (teal) simultaneously,
      // then lowers both. The algorithm decides the winner from its own aux copy.
      //
      // Note: position i may show a stale display value if the merge has already
      // written to it (k > i). The animation still correctly identifies *which*
      // position holds each candidate, even if the displayed number has changed.
      compare: async (i: number, j: number) => {
        if (abortRef.current) return;
        const idI = arr[i].id;
        const idJ = arr[j].id;
        setLifted(new Set([idI, idJ]));
        setStates(
          new Map([
            [idI, 'left'],
            [idJ, 'right'],
          ])
        );
        await delay(DEFAULT_ANIMATION_CONFIG.riseDuration);
        setLifted(new Set());
        setStates(new Map());
      },

      // No explicit delay — brackets animate via CSS transitions.
      setMergeRanges: async (
        leftLo: number,
        leftHi: number,
        rightLo: number,
        rightHi: number
      ) => {
        setLeftRange(leftHi > leftLo ? [leftLo, leftHi] : null);
        setRightRange(rightHi > rightLo ? [rightLo, rightHi] : null);
      },

      clearMergeRanges: async () => {
        setLeftRange(null);
        setRightRange(null);
      },
    };

    const run = async () => {
      await algorithm.sort(ops);

      setLifted(new Set());
      setStates(new Map());
      setLeftRange(null);
      setRightRange(null);

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

  // Pixel geometry helpers for bracket positioning.
  const bracketLeft = (lo: number) => lo * CELL_WIDTH + CELL_PADDING;
  const bracketWidth = (lo: number, hi: number) => (hi - lo) * CELL_WIDTH;

  return (
    <Box sx={{position: 'relative', display: 'inline-block'}}>
      <Array
        entries={displayEntries}
        slots={slots}
        lifted={lifted}
        states={states}
        transitionMs={animConfig.slideDuration}
      />

      {/* Left-half bracket (blue) — remaining [i, mid) */}
      {leftRange != null && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -6,
            left: bracketLeft(leftRange[0]),
            width: bracketWidth(leftRange[0], leftRange[1]),
            height: 4,
            backgroundColor: 'primary.main',
            borderRadius: 1,
            transition: 'left 150ms ease, width 150ms ease',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Right-half bracket (teal) — remaining [j, hi) */}
      {rightRange != null && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -6,
            left: bracketLeft(rightRange[0]),
            width: bracketWidth(rightRange[0], rightRange[1]),
            height: 4,
            backgroundColor: '#00897b',
            borderRadius: 1,
            transition: 'left 150ms ease, width 150ms ease',
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
}
