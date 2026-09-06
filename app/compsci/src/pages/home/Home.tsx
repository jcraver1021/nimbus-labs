import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {NimbusBreadcrumbs} from '@nimbus-labs/ui';
import AlgorithmsList from '../algorithms/AlgorithmsList';

function Home() {
  return (
    <Box sx={{p: 4, maxWidth: 700, mx: 'auto'}}>
      <NimbusBreadcrumbs items={[{label: 'CompSci'}]} />

      <Typography variant="h3" gutterBottom>
        CompSci
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Interactive visualizations for algorithms and data structures.
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Algorithms</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AlgorithmsList />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Data Structures</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            Coming soon.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Home;
