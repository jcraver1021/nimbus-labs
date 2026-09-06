import {Box, Typography} from '@mui/material';
import {NimbusBreadcrumbs} from '@nimbus-labs/ui';
import AlgorithmsList from './AlgorithmsList';

function Algorithms() {
  return (
    <Box sx={{p: 4, maxWidth: 700, mx: 'auto'}}>
      <NimbusBreadcrumbs
        items={[{label: 'CompSci', href: '/'}, {label: 'Algorithms'}]}
      />

      <Typography variant="h3" gutterBottom>
        Algorithms
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Interactive visualizations for algorithms.
      </Typography>

      <AlgorithmsList />
    </Box>
  );
}

export default Algorithms;
