import {useEffect, useRef, useState} from 'react';
import {Box, Button, Slider, Stack, Typography} from '@mui/material';
import {type Selection} from '../../common/selection';
import {type DatumEntry} from '../../common/datum';
import Array from '../../components/array/Array';

const minArraySize = 1;
const maxArraySize = 16;
const defaultArraySize = 5;

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
  const [entries, setEntries] = useState<DatumEntry[]>(() =>
    generateEntries(defaultArraySize)
  );
  const [slots, setSlots] = useState<Map<number, number>>(
    () => slotsFromEntries(generateEntries(0)) // empty; will sync on first generate
  );
  const [lifted, setLifted] = useState<Set<number>>(new Set());
  const [states, setStates] = useState<Map<number, Selection>>(new Map());
  const [inTransition, setInTransition] = useState(false);

  const abortRef = useRef(false);

  // Cancel any running sort when the component unmounts.
  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  function handleGenerate() {
    // Cancel any running sort before replacing the array.
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

    // Leave state alone during animation
    outer: for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (abortRef.current) break outer;

        const idA = arr[j].id;
        const idB = arr[j + 1].id;

        // Rise and highlight simultaneously.
        setLifted(new Set([idA, idB]));
        setStates(
          new Map([
            [idA, 'selected'],
            [idB, 'selected'],
          ])
        );
        await delay(300);
        if (abortRef.current) break outer;

        if (arr[j].value > arr[j + 1].value) {
          // Slide while raised.
          const animSlots = new Map(slotMap);
          animSlots.set(idA, j + 1);
          animSlots.set(idB, j);
          setSlots(animSlots);
          await delay(350);
          if (abortRef.current) break outer;

          // Commit the swap to local state only
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          slotMap.set(idA, j + 1);
          slotMap.set(idB, j);
        }

        setLifted(new Set());
        setStates(new Map());
        await delay(200);
        if (abortRef.current) break outer;
      }
    }

    setEntries([...arr]);
    setSlots(slotsFromEntries(arr));
    if (!abortRef.current) {
      setInTransition(false);
    }
  }

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
      <Typography variant="h6">Bubble Sort Algorithm:</Typography>
      <p className="code">
        for (let i = 0; i &lt; values.length; i++) {'{'}
        <br />
        &nbsp;&nbsp;for (let j = 0; j &lt; values.length - i - 1; j++) {'{'}
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;if (values[j] &gt; values[j + 1]) {'{'}
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swap(values, j, j + 1);
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;{'}'}
        <br />
        &nbsp;&nbsp;{'}'}
        <br />
        {'}'}
      </p>
      <Array entries={entries} slots={slots} lifted={lifted} states={states} />
    </Stack>
  );
}

export default ArraySort;
