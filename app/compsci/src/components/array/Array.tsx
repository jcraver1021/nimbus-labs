import {Box} from '@mui/material';
import Datum from '../datum/Datum';
import {type Selection} from '../../common/selection';
import {
  type DatumEntry,
  CELL_WIDTH,
  CELL_PADDING,
  DATUM_SIZE,
} from '../../common/datum';

import './Array.css';

type ArrayProps = {
  entries: DatumEntry[];
  slots?: Map<number, number>;
  lifted?: Set<number>;
  states?: Map<number, Selection>;
};

function Array({entries, slots, lifted, states}: ArrayProps) {
  const containerWidth =
    entries.length * CELL_WIDTH - (CELL_WIDTH - DATUM_SIZE) + CELL_PADDING * 2;
  const containerHeight = DATUM_SIZE + CELL_PADDING * 2;

  const cells = entries.map((entry, index) => {
    const slot = slots?.get(entry.id) ?? index;
    return (
      <Datum
        key={entry.id}
        value={entry.value}
        slot={slot}
        lifted={lifted?.has(entry.id) ?? false}
        state={states?.get(entry.id)}
      />
    );
  });

  return (
    <Box
      className="array"
      style={{width: containerWidth, height: containerHeight}}
    >
      {cells}
    </Box>
  );
}

export default Array;
