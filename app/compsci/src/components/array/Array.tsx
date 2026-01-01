import {Box} from '@mui/material';
import Datum from '../datum/Datum';
import {type Selection} from '../../common/selection';

import './Array.css';

type ArrayProps = {
  values: number[];
  states?: Map<number, Selection>;
};

function Array({values, states}: ArrayProps) {
  const cells = values.map((value, index) => (
    <Datum
      key={index}
      value={value}
      state={states ? states.get(index) : undefined}
    />
  ));

  return <Box className="array">{cells}</Box>;
}

export default Array;
