import {Link as RouterLink} from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {NimbusBreadcrumbs} from '@nimbus-labs/ui';

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
          <List disablePadding>
            <ListItemButton component={RouterLink} to="/algorithms/sort">
              <ListItemText
                primary="Sorting"
                secondary="Visualize array sorting algorithms"
              />
            </ListItemButton>
          </List>
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
