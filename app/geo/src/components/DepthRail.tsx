import {Box, Button, ButtonGroup, Slider, Typography} from '@mui/material';
import {eonJumps, type DiveStratum} from '../utils/diveSpine';
import './DepthRail.css';

export interface DepthRailProps {
  strata: DiveStratum[];
  /** Current depth, as a block index plus how far into that block. */
  depth: number;
  /** Called with the depth to travel to. */
  onDepthChange: (depth: number) => void;
}

/**
 * The far-left rail: a slider for scrubbing the whole 4.6 billion years, and
 * buttons that jump straight to the surface, to each eon, and to the bottom.
 *
 * The slider is inverted relative to its value — a vertical MUI slider puts
 * its minimum at the bottom, and here the minimum depth (the present) belongs
 * at the top.
 */
function DepthRail({strata, depth, onDepthChange}: DepthRailProps) {
  const floor = strata.length;
  const jumps = eonJumps(strata);

  const marks = jumps.map(jump => ({
    value: floor - jump.index,
    label: jump.eon,
  }));

  const activeIndex = Math.min(strata.length - 1, Math.floor(depth));
  const activeName = strata[activeIndex]?.division.name ?? '';

  return (
    <Box className="depth-rail" component="aside" aria-label="Depth controls">
      <Typography variant="overline" className="depth-rail-title">
        Depth
      </Typography>

      <Slider
        className="depth-rail-slider"
        orientation="vertical"
        // MUI sizes a vertical slider at 100% of its parent, which collapses
        // it in the stacked layout, so the height has to come from sx.
        sx={{height: {xs: '14rem', lg: '22rem'}, ml: 2, mr: {xs: 12, lg: 0}}}
        aria-label="Depth in geologic time"
        getAriaValueText={() => activeName}
        value={floor - depth}
        min={0}
        max={floor}
        step={0.01}
        marks={marks}
        onChange={(_event, value) => onDepthChange(floor - (value as number))}
      />

      <ButtonGroup
        className="depth-rail-jumps"
        orientation="vertical"
        size="small"
        variant="outlined"
        aria-label="Jump through geologic time"
      >
        <Button onClick={() => onDepthChange(0)}>Present</Button>
        {jumps.map(jump => (
          <Button key={jump.eon} onClick={() => onDepthChange(jump.index)}>
            {jump.eon}
          </Button>
        ))}
        <Button onClick={() => onDepthChange(floor)}>Earth forms</Button>
      </ButtonGroup>
    </Box>
  );
}

export default DepthRail;
