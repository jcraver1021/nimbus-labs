import {Box, Typography} from '@mui/material';
import {formatTimeYearsAgo} from '@nimbus-labs/deeptime';
import {EARTH_FORMED_YEARS_AGO, type DiveStratum} from '../utils/diveSpine';
import {
  FLOOR_HEIGHT_VH,
  SURFACE_HEIGHT_VH,
  strataGradient,
} from '../utils/diveLayout';
import StratumBlock from './StratumBlock';
import './StrataColumn.css';

export interface StrataColumnProps {
  strata: DiveStratum[];
  /** Index of the block under the depth marker. */
  activeIndex: number;
}

/**
 * The scrollable core sample: a surface band, one block per division from the
 * present downward, and the floor where the record runs out. The background
 * is a single gradient built from the divisions' own ICS colours, so scrolling
 * reads as continuous rock rather than a stack of cards.
 */
function StrataColumn({strata, activeIndex}: StrataColumnProps) {
  const colors = strata.map(stratum => stratum.color);
  const firstColor = colors[0];
  const lastColor = colors[colors.length - 1];

  return (
    <>
      <Box
        className="dive-surface"
        style={{
          // Exactly the depth marker's offset, so the scroll starts on today.
          height: `${SURFACE_HEIGHT_VH}vh`,
          backgroundImage: `linear-gradient(to bottom, #cfe4f7, #f3ece1 55%, ${firstColor})`,
        }}
      >
        <Typography variant="overline">Today · the surface</Typography>
        <Typography variant="caption">
          Scroll down to dig into the past
        </Typography>
      </Box>

      <Box
        component="ol"
        className="dive-strata"
        aria-label="Geologic divisions, present to oldest"
        style={{backgroundImage: strataGradient(colors)}}
      >
        {strata.map((stratum, index) => (
          <StratumBlock
            key={stratum.division.name}
            stratum={stratum}
            active={index === activeIndex}
          />
        ))}
      </Box>

      <Box
        className="dive-floor"
        style={{
          // The rest of the viewport, so the last block can reach the marker.
          height: `${FLOOR_HEIGHT_VH}vh`,
          backgroundColor: lastColor,
          // Picks up where the strata's own darkening left off, so the seam
          // between the last block and the floor doesn't show.
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.95))',
        }}
      >
        <Typography variant="overline">
          Earth forms · {formatTimeYearsAgo(EARTH_FORMED_YEARS_AGO)}
        </Typography>
        <Typography variant="caption">
          Below this there is no rock record at all
        </Typography>
      </Box>
    </>
  );
}

export default StrataColumn;
