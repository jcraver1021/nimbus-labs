import {Link} from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';

function Home() {
  return (
    <Box sx={{p: 4}}>
      <Typography variant="h3" gutterBottom>
        Biology Educational Apps
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the Nimbus Labs Biology workspace.
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This app uses the @nimbus-labs/deeptime library for evolutionary biology
        visualizations.
      </Typography>

      <Box sx={{mt: 4}}>
        <Typography variant="h5" gutterBottom>
          Visualizations
        </Typography>
        <Card sx={{maxWidth: 400, mt: 2}}>
          <CardActionArea component={Link} to="/timeline">
            <CardContent>
              <Typography variant="h6">Evolutionary Timeline</Typography>
              <Typography variant="body2" color="text.secondary">
                Scroll through deep time to see how arthropod lineages diverged
                over millions of years.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}

export default Home;
