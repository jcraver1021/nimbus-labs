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
  TextField,
  Typography,
} from '@mui/material';
import {NimbusBreadcrumbs} from '@nimbus-labs/ui';
import {type DatumEntry} from '../../../common/datum';
import {type SearchAlgorithm} from '../searchAlgorithm';
import {searchAlgorithms} from './algorithms';
import ProbeSearchScene from './ProbeSearchScene';
import QuickSelectScene from './QuickSelectScene';

const minArraySize = 1;
const maxArraySize = 16;
const defaultArraySize = 5;
const maxValue = 99;

const speedMarks = [
  {value: 0.5, label: '0.5×'},
  {value: 1, label: '1×'},
  {value: 2, label: '2×'},
  {value: 4, label: '4×'},
];

let nextId = 0;

// The search page always keeps its array sorted — binary search requires
// it, and linear search/quickselect work just as well on sorted input.
function generateEntries(size: number): DatumEntry[] {
  const values = globalThis.Array.from({length: size}, () =>
    Math.floor(Math.random() * (maxValue + 1))
  );
  values.sort((a, b) => a - b);
  return values.map(value => ({id: nextId++, value}));
}

function defaultTarget(
  algorithm: SearchAlgorithm,
  entries: DatumEntry[]
): number {
  if (algorithm.scene === 'quickselect') {
    return Math.max(Math.ceil(entries.length / 2), 1);
  }
  // Default to a value that's actually in the array, so the first run
  // trivially demonstrates the "found" case.
  const mid = entries[Math.floor(entries.length / 2)];
  return mid ? mid.value : 0;
}

function ArraySearch() {
  const [arraySize, setArraySize] = useState(defaultArraySize);
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [entries, setEntries] = useState<DatumEntry[]>(() =>
    generateEntries(defaultArraySize)
  );
  const [target, setTarget] = useState(() =>
    defaultTarget(searchAlgorithms[0], entries)
  );
  // Local text buffer for the target/k field, so the user can freely clear
  // or edit it without every keystroke being clamped back to a bound (e.g.
  // an empty field would otherwise parse as 0 and jump straight to the min).
  const [targetInput, setTargetInput] = useState(String(target));
  const [inTransition, setInTransition] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  // Incremented on Generate so the scene remounts with fresh initial state,
  // avoiding useEffect-based state resets inside the scene components.
  const [entriesKey, setEntriesKey] = useState(0);

  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  const algorithm: SearchAlgorithm = searchAlgorithms[algorithmIndex];
  const isQuickSelect = algorithm.scene === 'quickselect';
  const targetMin = isQuickSelect ? 1 : 0;
  const targetMax = isQuickSelect ? Math.max(entries.length, 1) : maxValue;

  // Updates target and its text buffer together, so the field never shows a
  // stale value after a programmatic change (Generate, algorithm switch).
  function setTargetAndInput(value: number) {
    setTarget(value);
    setTargetInput(String(value));
  }

  function handleGenerate() {
    abortRef.current = true;
    setInTransition(false);
    setSearchKey(0);
    const next = generateEntries(arraySize);
    setEntries(next);
    setTargetAndInput(defaultTarget(algorithm, next));
    setEntriesKey(k => k + 1);
  }

  function handleSearch() {
    abortRef.current = false;
    setSearchKey(k => k + 1);
    setInTransition(true);
  }

  function handleStop() {
    abortRef.current = true;
    setInTransition(false);
    setSearchKey(0);
  }

  function handleSearchEnd() {
    setInTransition(false);
  }

  const sceneKey = `${algorithm.scene}-${algorithmIndex}-${entriesKey}`;

  return (
    <Stack spacing={3} padding={4}>
      <NimbusBreadcrumbs
        items={[
          {label: 'CompSci', href: '/'},
          {label: 'Algorithms', href: '/algorithms'},
          {label: 'Searching'},
        ]}
      />

      {/* Title */}
      <Typography variant="h4" textAlign="center">
        Array Search Visualization
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
              onChange={e => {
                abortRef.current = true;
                setInTransition(false);
                setSearchKey(0);
                const idx = e.target.value as number;
                setAlgorithmIndex(idx);
                setTargetAndInput(
                  defaultTarget(searchAlgorithms[idx], entries)
                );
              }}
            >
              {searchAlgorithms.map((alg, idx) => (
                <MenuItem key={alg.name} value={idx}>
                  {alg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={isQuickSelect ? 'k (1 = smallest)' : 'Target value'}
            type="number"
            size="small"
            disabled={inTransition}
            value={targetInput}
            onChange={e => {
              const raw = e.target.value;
              setTargetInput(raw);
              // Let the field sit empty (or mid-edit) without forcing a
              // clamp; only commit once it's a real number.
              if (raw.trim() === '') return;
              const parsed = Number(raw);
              if (!Number.isFinite(parsed)) return;
              setTargetAndInput(
                Math.min(Math.max(Math.round(parsed), targetMin), targetMax)
              );
            }}
            onBlur={() => setTargetInput(String(target))}
            slotProps={{htmlInput: {min: targetMin, max: targetMax, step: 1}}}
          />
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
              <Button variant="contained" onClick={handleSearch}>
                Search
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
      {algorithm.scene === 'probe' && (
        <ProbeSearchScene
          key={sceneKey}
          algorithm={algorithm}
          entries={entries}
          target={target}
          speed={speed}
          searchKey={searchKey}
          abortRef={abortRef}
          onSearchEnd={handleSearchEnd}
        />
      )}
      {algorithm.scene === 'quickselect' && (
        <QuickSelectScene
          key={sceneKey}
          algorithm={algorithm}
          entries={entries}
          onEntriesChange={setEntries}
          k={target - 1}
          speed={speed}
          searchKey={searchKey}
          abortRef={abortRef}
          onSearchEnd={handleSearchEnd}
        />
      )}
    </Stack>
  );
}

export default ArraySearch;
