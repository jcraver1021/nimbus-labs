import {useEffect, useRef, useState} from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import {type Selection} from '../../common/selection';
import {type DatumEntry} from '../../common/datum';
import {type SortOps} from '../../common/sortAlgorithm';
import {algorithms} from './algorithms';
import Array from '../../components/array/Array';

const minArraySize = 1;
const maxArraySize = 16;
const defaultArraySize = 5;

// Animation timing constants (ms).
const RISE_MS = 300;
const SLIDE_MS = 350;
const LOWER_MS = 200;

let nextId = 0;

function generateEntries(size: number): DatumEntry[] {
  return globalThis.Array.from({length: size}, () => ({
    id: nextId++,
    value: Math.floor(Math.random() * 100),
  }));
}

function slotsFromEntries(entries: DatumEntry[]): Map<number, number> {
  return new Map(entries.map((e, i) => [e.id, i]));
}

function ArraySort() {
  const [arraySize, setArraySize] = useState(defaultArraySize);
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [entries, setEntries] = useState<DatumEntry[]>(() =>
    generateEntries(defaultArraySize)
  );
  const [slots, setSlots] = useState<Map<number, number>>(() =>
    slotsFromEntries(generateEntries(0))
  );
  const [lifted, setLifted] = useState<Set<number>>(new Set());
  const [states, setStates] = useState<Map<number, Selection>>(new Map());
  const [inTransition, setInTransition] = useState(false);

  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  function handleGenerate() {
    abortRef.current = true;
    setInTransition(false);
    setLifted(new Set());
    setStates(new Map());

    const next = generateEntries(arraySize);
    setEntries(next);
    setSlots(slotsFromEntries(next));
  }

  async function handleSort() {
    abortRef.current = false;
    setInTransition(true);

    const arr = [...entries];
    const slotMap = slotsFromEntries(arr);

    // Resolves after ms, or immediately if aborted.
    const delay = (ms: number) =>
      new Promise<void>(resolve => {
        if (abortRef.current) {
          resolve();
          return;
        }
        const id = setTimeout(resolve, ms);
        const poll = setInterval(() => {
          if (abortRef.current) {
            clearTimeout(id);
            clearInterval(poll);
            resolve();
          }
        }, 16);
        setTimeout(() => clearInterval(poll), ms + 1);
      });

    // Tracks which pair is currently risen so consecutive operations on the
    // same pair skip the redundant lower → rise cycle.
    let activeI: number | null = null;
    let activeJ: number | null = null;

    const rise = async (i: number, j: number) => {
      const idA = arr[i].id;
      const idB = arr[j].id;
      setLifted(new Set([idA, idB]));
      setStates(
        new Map([
          [idA, 'selected'],
          [idB, 'selected'],
        ])
      );
      activeI = i;
      activeJ = j;
      await delay(RISE_MS);
    };

    const lower = async () => {
      setLifted(new Set());
      setStates(new Map());
      activeI = null;
      activeJ = null;
      await delay(LOWER_MS);
    };

    // Ensures i and j are risen. Lowers the previous pair first if needed.
    const ensureRisen = async (i: number, j: number) => {
      if (activeI === i && activeJ === j) return;
      if (activeI !== null) await lower();
      await rise(i, j);
    };

    const ops: SortOps = {
      length: arr.length,

      compare: async (i, j) => {
        if (abortRef.current) return false;
        await ensureRisen(i, j);
        return abortRef.current ? false : arr[i].value > arr[j].value;
      },

      swap: async (i, j) => {
        if (abortRef.current) return;
        await ensureRisen(i, j);
        if (abortRef.current) return;

        // Slide.
        const idA = arr[i].id;
        const idB = arr[j].id;
        const animSlots = new Map(slotMap);
        animSlots.set(idA, j);
        animSlots.set(idB, i);
        setSlots(animSlots);
        await delay(SLIDE_MS);

        // Commit local data (entries state stays frozen during animation).
        [arr[i], arr[j]] = [arr[j], arr[i]];
        slotMap.set(idA, j);
        slotMap.set(idB, i);

        await lower();
      },
    };

    await algorithms[algorithmIndex].sort(ops);

    // Lower any pair left risen after the algorithm returns.
    if (activeI !== null) {
      setLifted(new Set());
      setStates(new Map());
    }

    // Push the final sorted order to React state in one shot.
    setEntries([...arr]);
    setSlots(slotsFromEntries(arr));

    if (!abortRef.current) {
      setInTransition(false);
    }
  }

  const algorithm = algorithms[algorithmIndex];

  return (
    <Stack spacing={2} alignItems="flex-start" padding={4}>
      <Typography variant="h4">Array Sort Visualization</Typography>
      <Stack spacing={2} alignItems="center">
        <Box>
          <Typography>Array Size</Typography>
          <Slider
            disabled={inTransition}
            defaultValue={arraySize}
            min={minArraySize}
            max={maxArraySize}
            onChange={(_e, newValue) => setArraySize(newValue as number)}
            valueLabelDisplay="auto"
          />
        </Box>
        <FormControl size="small" disabled={inTransition} sx={{minWidth: 180}}>
          <InputLabel>Algorithm</InputLabel>
          <Select
            label="Algorithm"
            value={algorithmIndex}
            onChange={e => setAlgorithmIndex(e.target.value as number)}
          >
            {algorithms.map((alg, idx) => (
              <MenuItem key={alg.name} value={idx}>
                {alg.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          disabled={inTransition}
          onClick={handleGenerate}
        >
          Generate
        </Button>
        {inTransition ? (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              abortRef.current = true;
              setInTransition(false);
              setLifted(new Set());
              setStates(new Map());
            }}
          >
            Stop
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSort}>
            Sort
          </Button>
        )}
      </Stack>
      <Typography variant="h6">{algorithm.name}</Typography>
      <Typography variant="body2">
        Time complexity: {algorithm.metadata.timeComplexity}
      </Typography>
      <pre className="code">{algorithm.code}</pre>
      <Array entries={entries} slots={slots} lifted={lifted} states={states} />
    </Stack>
  );
}

export default ArraySort;
