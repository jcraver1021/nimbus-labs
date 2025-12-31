import {Paper} from '@mui/material';
import {type Selection, getSelectionElevation} from '../../common/selection';

import './Datum.css';

type DatumProps = {
  value: number;
  state?: Selection;
};

function Datum({value, state}: DatumProps) {
  return (
    <Paper
      elevation={getSelectionElevation(state)}
      className={`data datum ${state ?? ''}`}
    >
      {value}
    </Paper>
  );
}

export default Datum;
