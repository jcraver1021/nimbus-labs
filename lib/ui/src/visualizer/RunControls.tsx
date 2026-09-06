import {Button, Stack} from '@mui/material';

export interface NimbusRunControlsProps {
  inTransition: boolean;
  onGenerate: () => void;
  onRun: () => void;
  onStop: () => void;
  runLabel: string; // Label for the primary button when idle (e.g. "Sort", "Search").
}

/**
 * Generate/Run/Stop button row shared by the sort and search visualizers:
 * Generate is disabled mid-run, and the primary button swaps to Stop once a
 * run starts.
 */
export function NimbusRunControls({
  inTransition,
  onGenerate,
  onRun,
  onStop,
  runLabel,
}: NimbusRunControlsProps) {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="contained" disabled={inTransition} onClick={onGenerate}>
        Generate
      </Button>
      {inTransition ? (
        <Button variant="outlined" color="error" onClick={onStop}>
          Stop
        </Button>
      ) : (
        <Button variant="contained" onClick={onRun}>
          {runLabel}
        </Button>
      )}
    </Stack>
  );
}
