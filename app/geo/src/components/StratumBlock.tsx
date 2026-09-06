import {Box, Typography} from '@mui/material';
import type {DiveStratum} from '../utils/diveSpine';
import {STRATUM_HEIGHT_PX} from '../utils/diveLayout';
import {formatDuration, formatSpan} from '../utils/earthFacts';

export interface StratumBlockProps {
  stratum: DiveStratum;
  /** True for the block currently under the depth marker. */
  active: boolean;
}

/**
 * One layer of the dive: where it sits in the hierarchy, what it's called,
 * how long it lasted, and the one thing it's known for. Everything else about
 * it lives in the side panel, which follows whichever block is active.
 */
function StratumBlock({stratum, active}: StratumBlockProps) {
  const {division, ancestry, earthState, color} = stratum;

  return (
    <Box
      component="li"
      className={active ? 'stratum stratum-active' : 'stratum'}
      style={{height: `${STRATUM_HEIGHT_PX}px`}}
      aria-current={active ? 'true' : undefined}
    >
      <Box className="stratum-card" style={{borderLeftColor: color}}>
        {ancestry.length > 0 && (
          <Typography variant="overline" className="stratum-ancestry">
            {ancestry.join(' › ')}
          </Typography>
        )}

        <Typography variant="h5" component="h2">
          {division.name}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          className="stratum-span"
        >
          <Box component="span" className="stratum-level">
            {division.level}
          </Box>{' '}
          · {formatSpan(division.start, division.end)} ·{' '}
          {formatDuration(division.end - division.start)} long
        </Typography>

        {earthState?.headline && (
          <Typography variant="body1" className="stratum-headline">
            {earthState.headline}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default StratumBlock;
