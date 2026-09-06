import {Link as RouterLink} from 'react-router-dom';
import {List, ListItemButton, ListItemText} from '@mui/material';

function AlgorithmsList() {
  return (
    <List disablePadding>
      <ListItemButton component={RouterLink} to="/algorithms/sort">
        <ListItemText
          primary="Sorting"
          secondary="Visualize array sorting algorithms"
        />
      </ListItemButton>
      <ListItemButton component={RouterLink} to="/algorithms/search">
        <ListItemText
          primary="Searching"
          secondary="Visualize linear search, binary search, and quickselect"
        />
      </ListItemButton>
    </List>
  );
}

export default AlgorithmsList;
