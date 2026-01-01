import {useState} from 'react';
import {Box, Button, Slider, Stack, Typography} from '@mui/material';
import Array from '../../components/array/Array';

const minArraySize = 1;
const maxArraySize = 16;
const defaultArraySize = 5;

function generateRandomArray(size: number): number[] {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}

function ArraySort() {
  const [arraySize, setArraySize] = useState(defaultArraySize);
  const [values, setValues] = useState(generateRandomArray(arraySize));
  const [states, setStates] = useState<Map<number, string>>(new Map());
  const [inTransition, setInTransition] = useState(false);

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
          onClick={() => setValues(generateRandomArray(arraySize))}
        >
          Generate
        </Button>
        <Button
          variant="contained"
          disabled={inTransition}
          onClick={async () => {
            setInTransition(true);
            // Simple Bubble Sort Visualization
            const arr = [...values];
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < arr.length - i - 1; j++) {
                setStates(
                  new Map([
                    [j, 'selected'],
                    [j + 1, 'selected'],
                  ])
                );
                await new Promise(resolve => setTimeout(resolve, 300));
                if (arr[j] > arr[j + 1]) {
                  setStates(
                    new Map([
                      [j, 'accepted'],
                      [j + 1, 'rejected'],
                    ])
                  );
                  await new Promise(resolve => setTimeout(resolve, 300));
                  const temp = arr[j];
                  arr[j] = arr[j + 1];
                  arr[j + 1] = temp;
                  setValues([...arr]);
                  await new Promise(resolve => setTimeout(resolve, 300));
                } else {
                  setStates(
                    new Map([
                      [j, 'rejected'],
                      [j + 1, 'accepted'],
                    ])
                  );
                  await new Promise(resolve => setTimeout(resolve, 300));
                }
                setStates(new Map());
              }
            }
            setInTransition(false);
          }}
        >
          Sort
        </Button>
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
      <Array values={values} states={states} />
    </Stack>
  );
}

export default ArraySort;
