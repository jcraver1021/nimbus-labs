import {useEffect, useRef, useState} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {type DatumEntry, CELL_WIDTH} from '../../common/datum';
import {type Selection, getSelectionElevation} from '../../common/selection';
import {type HeapAlgorithm} from '../../common/sortAlgorithm';
import {
  DEFAULT_ANIMATION_CONFIG,
  scaleAnimation,
} from '../../common/animationConfig';
import Array from '../../components/array/Array';

// ── Tree layout constants ──────────────────────────────────────────────────

const NODE_SIZE = 40;
const LEVEL_HEIGHT = 64;
const TREE_PADDING = 24;

// ── HeapTree ───────────────────────────────────────────────────────────────

type HeapTreeProps = {
  entries: DatumEntry[];
  slots: Map<number, number>;
  lifted: Set<number>;
  states: Map<number, Selection>;
  heapSize: number;
};

function HeapTree({entries, slots, lifted, states, heapSize}: HeapTreeProps) {
  const n = entries.length;
  if (n === 0) return null;

  // Build an index-keyed lookup: slot position → entry
  const bySlot = new Map<number, DatumEntry>();
  for (const entry of entries) {
    bySlot.set(slots.get(entry.id) ?? 0, entry);
  }

  const levels = Math.floor(Math.log2(n)) + 1;
  const treeHeight = levels * LEVEL_HEIGHT + TREE_PADDING * 2;
  // Width based on the widest level (bottom), matching the array width roughly.
  const bottomCount = Math.pow(2, levels - 1);
  const treeWidth = Math.max(bottomCount * (NODE_SIZE + 8), n * CELL_WIDTH);

  function nodePosition(i: number): {x: number; y: number} {
    const level = Math.floor(Math.log2(i + 1));
    const levelStart = Math.pow(2, level) - 1;
    const posInLevel = i - levelStart;
    const totalInLevel = Math.pow(2, level);
    const x = ((posInLevel + 0.5) / totalInLevel) * treeWidth;
    const y = TREE_PADDING + level * LEVEL_HEIGHT;
    return {x, y};
  }

  // Build edges (parent → child).
  const edges: {x1: number; y1: number; x2: number; y2: number}[] = [];
  for (let i = 1; i < n; i++) {
    const parent = Math.floor((i - 1) / 2);
    const {x: px, y: py} = nodePosition(parent);
    const {x: cx, y: cy} = nodePosition(i);
    edges.push({x1: px, y1: py, x2: cx, y2: cy});
  }

  return (
    <Box sx={{position: 'relative', width: treeWidth, height: treeHeight}}>
      {/* SVG for edges */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: treeWidth,
          height: treeHeight,
          pointerEvents: 'none',
        }}
      >
        {edges.map(({x1, y1, x2, y2}, idx) => (
          <line
            key={idx}
            x1={x1}
            y1={y1 + NODE_SIZE / 2}
            x2={x2}
            y2={y2 - NODE_SIZE / 2}
            stroke="#aaa"
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {/* Nodes */}
      {globalThis.Array.from({length: n}, (_, i) => {
        const entry = bySlot.get(i);
        if (!entry) return null;
        const {x, y} = nodePosition(i);
        const isLifted = lifted.has(entry.id);
        const state = i >= heapSize ? 'sorted' : states.get(entry.id);
        const elevation = getSelectionElevation(state);
        return (
          <Paper
            key={entry.id}
            elevation={elevation}
            className={`data ${state ?? ''}`}
            style={{
              position: 'absolute',
              width: NODE_SIZE,
              height: NODE_SIZE,
              left: x - NODE_SIZE / 2,
              top: y - NODE_SIZE / 2 - (isLifted ? 8 : 0),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              transition: `top ${DEFAULT_ANIMATION_CONFIG.riseDuration}ms ease,
                           background-color ${DEFAULT_ANIMATION_CONFIG.riseDuration}ms ease`,
              fontSize: 13,
              fontFamily: "'Source Code Pro', monospace",
              border: '1px solid #ccc',
            }}
          >
            <Typography variant="caption" fontFamily="inherit">
              {entry.value}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
}

// ── HeapSortScene ──────────────────────────────────────────────────────────

type Props = {
  algorithm: HeapAlgorithm;
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

export default function HeapSortScene({
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
  const [heapSize, setHeapSizeState] = useState(entries.length);

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  });

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
      // Only clear 'selected' state; preserve 'sorted' markers accumulated
      // by setHeapSize so sorted elements stay highlighted throughout.
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

      setHeapSize: async (size: number) => {
        setHeapSizeState(size);
        // Re-apply sorted state to elements outside heap boundary.
        setStates(prev => {
          const next = new Map(prev);
          for (let k = size; k < arr.length; k++) {
            next.set(arr[k].id, 'sorted');
          }
          return next;
        });
        await delay(DEFAULT_ANIMATION_CONFIG.lowerDuration);
      },
    };

    const run = async () => {
      // Initialise heap size to full array.
      setHeapSizeState(arr.length);

      await algorithm.sort(ops);

      if (activeI !== null) {
        setLifted(new Set());
      }
      // Mark all as sorted on completion.
      setStates(new Map(arr.map(e => [e.id, 'sorted'])));

      onEntriesChange([...arr]);
      setSlots(slotsFromEntries(arr));

      if (!abortRef.current) {
        onSortEnd();
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey]);

  const animConfig = scaleAnimation(DEFAULT_ANIMATION_CONFIG, speed);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
      <HeapTree
        entries={entries}
        slots={slots}
        lifted={lifted}
        states={states}
        heapSize={heapSize}
      />
      <Array
        entries={entries}
        slots={slots}
        lifted={lifted}
        states={states}
        transitionMs={animConfig.slideDuration}
      />
    </Box>
  );
}
