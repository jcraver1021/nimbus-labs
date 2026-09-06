import {useMemo} from 'react';
import {Box, Chip, Divider, Stack, Typography} from '@mui/material';
import {formatTimeYearsAgo, getSkyState} from '@nimbus-labs/deeptime';
import type {DiveStratum} from '../utils/diveSpine';
import {
  buildEarthFacts,
  formatInheritance,
  formatSpan,
} from '../utils/earthFacts';
import './EarthStatePanel.css';

export interface EarthStatePanelProps {
  stratum: DiveStratum;
  /** Exact point in the past the depth marker has reached, in years ago. */
  yearsAgo: number;
}

/**
 * The open space on the right: what the planet was actually like at the depth
 * currently under the marker.
 *
 * The curated facts change block by block, but the sky is computed from the
 * exact time under the marker, so the day and the Moon shift continuously as
 * you scroll rather than jumping between divisions.
 */
function EarthStatePanel({stratum, yearsAgo}: EarthStatePanelProps) {
  const {division, earthState} = stratum;

  const facts = useMemo(
    () => buildEarthFacts(earthState, getSkyState(yearsAgo)),
    [earthState, yearsAgo]
  );

  const inheritance = formatInheritance(earthState);

  return (
    <Box
      className="earth-state-panel"
      component="aside"
      aria-label="The world at this depth"
      aria-live="polite"
    >
      <Typography variant="overline" color="text.secondary">
        The world at {formatTimeYearsAgo(Math.round(yearsAgo))}
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom>
        {division.name}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {formatSpan(division.start, division.end)}
      </Typography>

      <Divider sx={{my: 2}} />

      <Stack spacing={2}>
        {facts.map(fact => (
          <Box key={fact.label}>
            <Typography variant="overline" className="earth-fact-label">
              {fact.label}
            </Typography>

            {fact.items ? (
              <Box className="earth-fact-chips">
                {fact.items.map(item => (
                  <Chip key={item} label={item} size="small" />
                ))}
              </Box>
            ) : (
              <Typography variant="body1">{fact.value}</Typography>
            )}

            {fact.detail && (
              <Typography variant="caption" color="text.secondary">
                {fact.detail}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>

      {earthState?.notes && earthState.notes.length > 0 && (
        <>
          <Divider sx={{my: 2}} />
          <Box component="ul" className="earth-state-notes">
            {earthState.notes.map(note => (
              <Typography component="li" variant="body2" key={note}>
                {note}
              </Typography>
            ))}
          </Box>
        </>
      )}

      {inheritance && (
        <Typography
          variant="caption"
          color="text.secondary"
          className="earth-state-provenance"
        >
          {inheritance} Every value is a best estimate, and the uncertainty
          grows with age.
        </Typography>
      )}
    </Box>
  );
}

export default EarthStatePanel;
