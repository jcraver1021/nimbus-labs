import {Paper} from '@mui/material';
import {type Selection, getSelectionElevation} from '../../common/selection';
import {CELL_WIDTH, DATUM_SIZE, LIFT_PX} from '../../common/datum';

import './Datum.css';

type DatumProps = {
  value: number;
  slot: number;
  lifted?: boolean;
  state?: Selection;
};

function Datum({value, slot, lifted = false, state}: DatumProps) {
  const x = slot * CELL_WIDTH;
  const y = lifted ? -LIFT_PX : 0;
  return (
    <Paper
      elevation={getSelectionElevation(state)}
      className={`data datum ${state ?? ''}`}
      style={{
        position: 'absolute',
        width: DATUM_SIZE,
        height: DATUM_SIZE,
        transform: `translateX(${x}px) translateY(${y}px)`,
        transition:
          'transform var(--datum-transition-ms, 350ms) ease,' +
          ' background-color var(--datum-transition-ms, 350ms) ease',
      }}
    >
      {value}
    </Paper>
  );
}

export default Datum;
