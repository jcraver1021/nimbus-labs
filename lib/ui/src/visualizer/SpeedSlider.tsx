import {Box, Slider, Typography} from '@mui/material';

const SPEED_MARKS = [
  {value: 0.5, label: '0.5×'},
  {value: 1, label: '1×'},
  {value: 2, label: '2×'},
  {value: 4, label: '4×'},
];

export interface NimbusSpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Playback-speed control shared by the sort and search visualizers, snapping
 * to 0.5×/1×/2×/4× marks.
 */
export function NimbusSpeedSlider({value, onChange}: NimbusSpeedSliderProps) {
  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        Speed
      </Typography>
      <Slider
        aria-label="Speed"
        value={value}
        min={0.5}
        max={4}
        step={null}
        marks={SPEED_MARKS}
        onChange={(_e, newValue) => onChange(newValue as number)}
        sx={{minWidth: 180}}
      />
    </Box>
  );
}
