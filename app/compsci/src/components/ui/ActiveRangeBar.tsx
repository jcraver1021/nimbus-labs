import {Box} from '@mui/material';
import {CELL_WIDTH, CELL_PADDING} from '../../common/datum';

type Props = {
  range: [number, number] | null; // The [lo, hi) range to underline, or null to hide the bar.
};

/**
 * Absolutely-positioned bar under an <Array>, spanning cells [lo, hi).
 * Shared by every scene that highlights a shrinking/sliding sub-range: the
 * outer-loop scope in flat sorts, quicksort/quickselect's partition range,
 * and binary search's narrowing window.
 */
export default function ActiveRangeBar({range}: Props) {
  if (range == null) return null;

  const left = range[0] * CELL_WIDTH + CELL_PADDING;
  const width = (range[1] - range[0]) * CELL_WIDTH;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: -6,
        left,
        width,
        height: 4,
        backgroundColor: 'primary.main',
        borderRadius: 1,
        transition: 'left 150ms ease, width 150ms ease',
        pointerEvents: 'none',
      }}
    />
  );
}
