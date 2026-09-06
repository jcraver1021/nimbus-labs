import {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import {type DatumEntry} from '../../../common/datum';
import {type Selection} from '../../../common/selection';
import {type ProbeSearchAlgorithm} from '../searchAlgorithm';
import {
  DEFAULT_ANIMATION_CONFIG,
  scaleAnimation,
} from '../../../common/animationConfig';
import {createDelay} from '../../../common/delay';
import {createLiftController} from '../../../common/liftController';
import ActiveRangeBar from '../../../components/ui/ActiveRangeBar';
import Array from '../../../components/data/array/Array';

type Props = {
  algorithm: ProbeSearchAlgorithm;
  entries: DatumEntry[]; // Current entries from the parent. Never reordered by a probe search.
  target: number; // Value being searched for.
  speed: number;
  searchKey: number; // Increment to trigger a new search. 0 = no search on mount.
  abortRef: React.RefObject<boolean>;
  onSearchEnd: () => void;
};

export default function ProbeSearchScene({
  algorithm,
  entries,
  target,
  speed,
  searchKey,
  abortRef,
  onSearchEnd,
}: Props) {
  const [lifted, setLifted] = useState<Set<number>>(new Set());
  const [states, setStates] = useState<Map<number, Selection>>(new Map());
  const [activeRange, setActiveRangeState] = useState<[number, number] | null>(
    null
  );

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  });

  // Run the search whenever searchKey is incremented.
  useEffect(() => {
    if (searchKey === 0) return;

    const arr = [...entries];
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

      markFound: async (index: number) => {
        const id = arr[index].id;
        setStates(prev => new Map(prev).set(id, 'sorted'));
      },

      probe: async (i: number) => {
        if (abortRef.current) return arr[i].value;
        await lift.ensureRisen([arr[i].id]);
        return arr[i].value;
      },
    };

    const run = async () => {
      setStates(new Map());

      await algorithm.search(ops, target);

      if (lift.isRisen()) {
        setLifted(new Set());
      }
      setActiveRangeState(null);

      if (!abortRef.current) {
        onSearchEnd();
      }
    };

    run();
    // searchKey is the only intended trigger; other deps are stable refs or don't change mid-search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);

  const animConfig = scaleAnimation(DEFAULT_ANIMATION_CONFIG, speed);

  return (
    <Box sx={{position: 'relative', display: 'inline-block'}}>
      <Array
        entries={entries}
        states={states}
        lifted={lifted}
        transitionMs={animConfig.slideDuration}
      />
      <ActiveRangeBar range={activeRange} />
    </Box>
  );
}
