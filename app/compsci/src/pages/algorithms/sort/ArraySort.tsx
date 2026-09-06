import {useEffect, useRef, useState} from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {
  NimbusArraySizeSlider,
  NimbusBreadcrumbs,
  NimbusRunControls,
  NimbusSpeedSlider,
  NIMBUS_DEFAULT_ARRAY_SIZE,
} from '@nimbus-labs/ui';
import {AlgorithmInfoPanel} from '../../../common/AlgorithmInfoPanel';
import {type DatumEntry} from '../../../common/datum';
import {
  type Algorithm,
  type FlatAlgorithm,
  type MergeAlgorithm,
  type HeapAlgorithm,
  type QuickAlgorithm,
} from '../sortAlgorithm';
import {algorithms} from './algorithms';
import FlatSortScene from './FlatSortScene';
import MergeSortScene from './MergeSortScene';
import HeapSortScene from './HeapSortScene';
import QuickSortScene from './QuickSortScene';

let nextId = 0;

function generateEntries(size: number): DatumEntry[] {
  return globalThis.Array.from({length: size}, () => ({
    id: nextId++,
    value: Math.floor(Math.random() * 100),
  }));
}

function ArraySort() {
  const [arraySize, setArraySize] = useState(NIMBUS_DEFAULT_ARRAY_SIZE);
  const [algorithmIndex, setAlgorithmIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [entries, setEntries] = useState<DatumEntry[]>(() =>
    generateEntries(NIMBUS_DEFAULT_ARRAY_SIZE)
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
    setSortKey(0);
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
    setSortKey(0);
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
      <NimbusBreadcrumbs
        items={[
          {label: 'CompSci', href: '/'},
          {label: 'Algorithms', href: '/algorithms'},
          {label: 'Sorting'},
        ]}
      />

      {/* Title */}
      <Typography variant="h4" textAlign="center">
        Array Sort Visualization
      </Typography>

      {/* Top row: controls left, algorithm info right */}
      <Box sx={{display: 'flex', gap: 4, alignItems: 'flex-start'}}>
        {/* Controls */}
        <Stack spacing={2} sx={{minWidth: 200}}>
          <NimbusArraySizeSlider
            disabled={inTransition}
            defaultValue={arraySize}
            onChange={setArraySize}
          />
          <NimbusSpeedSlider value={speed} onChange={setSpeed} />
          <FormControl size="small" disabled={inTransition}>
            <InputLabel id="sort-algorithm-label">Algorithm</InputLabel>
            <Select
              labelId="sort-algorithm-label"
              label="Algorithm"
              value={algorithmIndex}
              onChange={e => {
                abortRef.current = true;
                setInTransition(false);
                setSortKey(0);
                setAlgorithmIndex(e.target.value as number);
              }}
            >
              {algorithms.map((alg, idx) => (
                <MenuItem key={alg.name} value={idx}>
                  {alg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <NimbusRunControls
            inTransition={inTransition}
            onGenerate={handleGenerate}
            onRun={handleSort}
            onStop={handleStop}
            runLabel="Sort"
          />
        </Stack>

        <AlgorithmInfoPanel
          name={algorithm.name}
          timeComplexity={algorithm.metadata.timeComplexity}
          code={algorithm.code}
        />
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
      {algorithm.scene === 'quick' && (
        <QuickSortScene
          key={sceneKey}
          algorithm={algorithm as QuickAlgorithm}
          {...sceneProps}
        />
      )}
    </Stack>
  );
}

export default ArraySort;
