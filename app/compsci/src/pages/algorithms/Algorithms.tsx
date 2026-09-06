import {Box, Typography} from '@mui/material';
import {NimbusPageHeader} from '@nimbus-labs/ui';
import AlgorithmsList from './AlgorithmsList';

function Algorithms() {
  return (
    <Box sx={{p: 4, maxWidth: 700, mx: 'auto'}}>
      <NimbusPageHeader
        breadcrumbs={[{label: 'CompSci', href: '/'}, {label: 'Algorithms'}]}
        title="Algorithms"
      >
        <Typography variant="body1" color="text.secondary" paragraph>
          Interactive visualizations for algorithms.
        </Typography>
      </NimbusPageHeader>

      <AlgorithmsList />
    </Box>
  );
}

export default Algorithms;
