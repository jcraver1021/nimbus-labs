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
import {type DatumEntry} from '../../common/datum';
import {
  type Algorithm,
  type FlatAlgorithm,
  type MergeAlgorithm,
  type HeapAlgorithm,
} from '../../common/sortAlgorithm';
import {algorithms} from './algorithms';
import FlatSortScene from './FlatSortScene';
import MergeSortScene from './MergeSortScene';
import HeapSortScene from './HeapSortScene';

const minArraySize = 1;
const maxArraySize = 16;
const defaultArraySize = 5;

const speedMarks = [
  {value: 0.5, label: '0.5×'},
  {value: 1, label: '1×'},
  {value: 2, label: '2×'},
  {value: 4, label: '4×'},
];

let nextId = 0;

function generateEntries(size: number): DatumEntry[] {
  return globalThis.Array.from({length: size}, () => ({
    id: nextId++,
    value: Math.floor(Math.random() * 100),
  }));
}

function ArraySort() {
  const [arraySize, setArraySize] = useState(defaultArraySize);
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [entries, setEntries] = useState<DatumEntry[]>(() =>
    generateEntries(defaultArraySize)
  );
  const [inTransition, setInTransition] = useState(false);
  const [sortKey, setSortKey] = useState(0);
  // Incremented on Generate so the scene remounts with fresh initial state,
  // avoiding useEffect-based state resets inside the scene components.
  const [entriesKey, setEntriesKey] = useState(0);

  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  function handleGenerate() {
    abortRef.current = true;
    setInTransition(false);
    setEntries(generateEntries(arraySize));
    setEntriesKey(k => k + 1);
  }

  function handleSort() {
    abortRef.current = false;
    setSortKey(k => k + 1);
    setInTransition(true);
  }

  function handleStop() {
    abortRef.current = true;
    setInTransition(false);
  }

  function handleSortEnd() {
    setInTransition(false);
  }

  const algorithm: Algorithm = algorithms[algorithmIndex];

  const sceneKey = `${algorithm.scene}-${algorithmIndex}-${entriesKey}`;

  const sceneProps = {
    entries,
    onEntriesChange: setEntries,
    speed,
    sortKey,
    abortRef,
    onSortEnd: handleSortEnd,
  };

  return (
    <Stack spacing={3} padding={4}>
      {/* Title */}
      <Typography variant="h4" textAlign="center">
        Array Sort Visualization
      </Typography>

      {/* Top row: controls left, algorithm info right */}
      <Box sx={{display: 'flex', gap: 4, alignItems: 'flex-start'}}>
        {/* Controls */}
        <Stack spacing={2} sx={{minWidth: 200}}>
          <Box>
            <Typography variant="body2" gutterBottom>
              Array Size
            </Typography>
            <Slider
              disabled={inTransition}
              defaultValue={arraySize}
              min={minArraySize}
              max={maxArraySize}
              onChange={(_e, newValue) => setArraySize(newValue as number)}
              valueLabelDisplay="auto"
              sx={{minWidth: 180}}
            />
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>
              Speed
            </Typography>
            <Slider
              value={speed}
              min={0.5}
              max={4}
              step={null}
              marks={speedMarks}
              onChange={(_e, newValue) => setSpeed(newValue as number)}
              sx={{minWidth: 180}}
            />
          </Box>
          <FormControl size="small" disabled={inTransition}>
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
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={inTransition}
              onClick={handleGenerate}
            >
              Generate
            </Button>
            {inTransition ? (
              <Button variant="outlined" color="error" onClick={handleStop}>
                Stop
              </Button>
            ) : (
              <Button variant="contained" onClick={handleSort}>
                Sort
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Algorithm info + pseudocode */}
        <Box sx={{flex: 1, minWidth: 0}}>
          <Typography variant="h6">{algorithm.name}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Time complexity: {algorithm.metadata.timeComplexity}
          </Typography>
          <pre
            className="code"
            style={{
              maxHeight: 260,
              overflowY: 'auto',
              margin: 0,
            }}
          >
            {algorithm.code}
          </pre>
        </Box>
      </Box>

      {/* Visualization */}
      {algorithm.scene === 'flat' && (
        <FlatSortScene
          key={sceneKey}
          algorithm={algorithm as FlatAlgorithm}
          {...sceneProps}
        />
      )}
      {algorithm.scene === 'merge' && (
        <MergeSortScene
          key={sceneKey}
          algorithm={algorithm as MergeAlgorithm}
          {...sceneProps}
        />
      )}
      {algorithm.scene === 'heap' && (
        <HeapSortScene
          key={sceneKey}
          algorithm={algorithm as HeapAlgorithm}
          {...sceneProps}
        />
      )}
    </Stack>
  );
}

export default ArraySort;
