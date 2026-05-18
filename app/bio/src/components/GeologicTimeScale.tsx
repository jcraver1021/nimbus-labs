import {Box, Typography} from '@mui/material';
import {
  getEons,
  getEras,
  getPeriods,
  getEpochs,
  type GeologicPeriod,
} from '@nimbus-labs/deeptime';
import './GeologicTimeScale.css';

interface GeologicTimeScaleProps {
  timeRange: {start: number; end: number};
  totalYears: number;
  timelineHeight: number;
}

function GeologicTimeScale({
  timeRange,
  totalYears,
  timelineHeight,
}: GeologicTimeScaleProps) {
  // Filter items in our time range
  const inRange = (item: GeologicPeriod) =>
    item.start <= timeRange.start && item.end >= timeRange.end;

  const eons = getEons().filter(inRange);
  const eras = getEras().filter(inRange);
  const periods = getPeriods().filter(inRange);
  const epochs = getEpochs().filter(inRange);

  return (
    <Box className="geologic-time-scale">
      {/* Eon labels (leftmost column) */}
      <Box className="eon-column">
        {eons.map(eon => {
          const top =
            ((timeRange.start - eon.start) / totalYears) * timelineHeight;
          const height = ((eon.start - eon.end) / totalYears) * timelineHeight;

          return (
            <Box
              key={eon.name}
              className="eon-label"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                borderLeft: `5px solid ${eon.color}`,
              }}
            >
              <Typography variant="subtitle2" className="eon-text">
                {eon.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Era labels */}
      <Box className="era-column">
        {eras.map(era => {
          const top =
            ((timeRange.start - era.start) / totalYears) * timelineHeight;
          const height = ((era.start - era.end) / totalYears) * timelineHeight;

          return (
            <Box
              key={era.name}
              className="era-label"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: era.color,
              }}
            >
              <Typography variant="caption" className="era-text">
                {era.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Period labels */}
      <Box className="period-column">
        {periods.map(period => {
          const top =
            ((timeRange.start - period.start) / totalYears) * timelineHeight;
          const height =
            ((period.start - period.end) / totalYears) * timelineHeight;

          return (
            <Box
              key={period.name}
              className="period-label"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: period.color,
              }}
            >
              <Typography variant="caption" className="period-text">
                {period.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Epoch bands (rightmost - finest detail) */}
      <Box className="epoch-column">
        {epochs.map(epoch => {
          const top =
            ((timeRange.start - epoch.start) / totalYears) * timelineHeight;
          const height =
            ((epoch.start - epoch.end) / totalYears) * timelineHeight;

          return (
            <Box
              key={epoch.name}
              className="epoch-band"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                backgroundColor: epoch.color,
              }}
            >
              <Typography variant="caption" className="epoch-text">
                {epoch.name}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default GeologicTimeScale;
