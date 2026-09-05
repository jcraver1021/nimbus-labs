import {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import {type DatumEntry} from '../../../common/datum';
import {type Selection} from '../../../common/selection';
import {type FlatAlgorithm} from '../sortAlgorithm';
import {
  DEFAULT_ANIMATION_CONFIG,
  scaleAnimation,
} from '../../../common/animationConfig';
import {createDelay} from '../../../common/delay';
import {slotsFromEntries} from '../../../common/slots';
import {createLiftController} from '../../../common/liftController';
import ActiveRangeBar from '../../../components/ui/ActiveRangeBar';
import Array from '../../../components/data/array/Array';

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
      // Discard any 'sorted' markers left over from a previous run on this
      // same array — they don't reflect this run's progress and would
      // otherwise get clobbered mid-compare (see rise/lower above).
      setStates(new Map());

      await algorithm.sort(ops);

      if (lift.isRisen()) {
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

  return (
    <Box sx={{position: 'relative', display: 'inline-block'}}>
      <Array
        entries={entries}
        slots={slots}
        lifted={lifted}
        states={states}
        transitionMs={animConfig.slideDuration}
      />
      <ActiveRangeBar range={activeRange} />
    </Box>
  );
}
