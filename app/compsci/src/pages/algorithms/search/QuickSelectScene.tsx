import {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import {type DatumEntry} from '../../../common/datum';
import {type Selection} from '../../../common/selection';
import {type QuickSelectAlgorithm} from '../searchAlgorithm';
import {
  DEFAULT_ANIMATION_CONFIG,
  scaleAnimation,
} from '../../../common/animationConfig';
import {createDelay} from '../../../common/delay';
import {slotsFromEntries} from '../../../common/slots';
import {createLiftController} from '../../../common/liftController';
import {usePivotMarker, withPivotOverlay} from '../../../common/pivotMarker';
import ActiveRangeBar from '../../../components/ui/ActiveRangeBar';
import Array from '../../../components/data/array/Array';

type Props = {
  algorithm: QuickSelectAlgorithm;
  entries: DatumEntry[];
  onEntriesChange: (entries: DatumEntry[]) => void; // Called with the (partially reordered) array once the search completes.
  k: number; // 0-indexed rank to find (0 = smallest).
  speed: number;
  searchKey: number; // Increment to trigger a new search. 0 = no search on mount.
  abortRef: React.RefObject<boolean>;
  onSearchEnd: () => void;
};

export default function QuickSelectScene({
  algorithm,
  entries,
  onEntriesChange,
  k,
  speed,
  searchKey,
  abortRef,
  onSearchEnd,
}: Props) {
  const [slots, setSlots] = useState<Map<number, number>>(() =>
    slotsFromEntries(entries)
  );
  const [lifted, setLifted] = useState<Set<number>>(new Set());
  const [states, setStates] = useState<Map<number, Selection>>(new Map());
  const {pivotId, setPivot, clearPivot, reset: resetPivot} = usePivotMarker();
  const [activeRange, setActiveRangeState] = useState<[number, number] | null>(
    null
  );

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  });

  useEffect(() => {
    if (searchKey === 0) return;

    const arr = [...entries];
    const slotMap = slotsFromEntries(arr);
    const delay = createDelay(speedRef, abortRef);
    const lift = createLiftController(
      setLifted,
      setStates,
      delay,
      DEFAULT_ANIMATION_CONFIG.riseDuration,
      DEFAULT_ANIMATION_CONFIG.lowerDuration
    );

    const ops = {
      length: arr.length,

      setActiveRange: async (lo: number, hi: number) => {
        setActiveRangeState([lo, hi]);
      },

      clearActiveRange: async () => {
        setActiveRangeState(null);
      },

      setPivot: (index: number) => setPivot(arr, index),

      clearPivot,

      // Every index this touches genuinely is in its final sorted position
      // (that's the Lomuto partition guarantee) — including pivots visited
      // on the way to the target, not just the target itself.
      markSorted: async (index: number) => {
        const id = arr[index].id;
        setStates(prev => new Map(prev).set(id, 'sorted'));
      },

      compare: async (i: number, j: number) => {
        if (abortRef.current) return false;
        await lift.ensureRisen([arr[i].id, arr[j].id]);
        return abortRef.current ? false : arr[i].value > arr[j].value;
      },

      swap: async (i: number, j: number) => {
        if (abortRef.current) return;
        await lift.ensureRisen([arr[i].id, arr[j].id]);
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

        await lift.lower();
      },
    };

    const run = async () => {
      setStates(new Map());

      await algorithm.search(ops, k);

      if (lift.isRisen()) {
        setLifted(new Set());
      }
      setActiveRangeState(null);
      resetPivot();
      // Unlike quicksort, quickselect doesn't finish with a fully sorted
      // array — only the pivots visited along the way (already marked
      // 'sorted' above, including the target) are in confirmed position.

      onEntriesChange([...arr]);
      setSlots(slotsFromEntries(arr));

      if (!abortRef.current) {
        onSearchEnd();
      }
    };

    run();
    // searchKey is the only intended trigger; other deps are stable refs or don't change mid-search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const animConfig = scaleAnimation(DEFAULT_ANIMATION_CONFIG, speed);
  const renderStates = withPivotOverlay(states, pivotId);

  return (
    <Box sx={{position: 'relative', display: 'inline-block'}}>
      <Array
        entries={entries}
        slots={slots}
        lifted={lifted}
        states={renderStates}
        transitionMs={animConfig.slideDuration}
      />
      <ActiveRangeBar range={activeRange} />
    </Box>
  );
}
