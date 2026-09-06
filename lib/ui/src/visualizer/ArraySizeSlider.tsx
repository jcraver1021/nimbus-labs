import {Box, Slider, Typography} from '@mui/material';

export const NIMBUS_MIN_ARRAY_SIZE = 1;
export const NIMBUS_MAX_ARRAY_SIZE = 16;
export const NIMBUS_DEFAULT_ARRAY_SIZE = 5;

export interface NimbusArraySizeSliderProps {
  disabled?: boolean;
  defaultValue?: number;
  onChange: (value: number) => void;
}

/**
 * Array-size control shared by the sort and search visualizers, bounded to
 * [1, 16] with a default of 5.
 */
export function NimbusArraySizeSlider({
  disabled,
  defaultValue = NIMBUS_DEFAULT_ARRAY_SIZE,
  onChange,
}: NimbusArraySizeSliderProps) {
  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        Array Size
      </Typography>
      <Slider
        aria-label="Array size"
        disabled={disabled}
        defaultValue={defaultValue}
        min={NIMBUS_MIN_ARRAY_SIZE}
        max={NIMBUS_MAX_ARRAY_SIZE}
        onChange={(_e, newValue) => onChange(newValue as number)}
        valueLabelDisplay="auto"
        sx={{minWidth: 180}}
      />
    </Box>
  );
}
