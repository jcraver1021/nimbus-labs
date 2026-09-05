import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
} from '@mui/material';
import {getNimbusAppUrl} from '@nimbus-labs/ui';

const apps = [
  {
    id: 'bio' as const,
    name: 'Bio',
    description:
      'Evolutionary biology visualizations, including a scrollable deep-time timeline.',
  },
  {
    id: 'compsci' as const,
    name: 'CompSci',
    description:
      'Interactive visualizations for algorithms and data structures.',
  },
];

function Home() {
  return (
    <Box sx={{p: 4, maxWidth: 900, mx: 'auto'}}>
      <Typography variant="h3" gutterBottom>
        Nimbus Labs
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        A collection of small educational apps. Pick one below to get started.
      </Typography>

      <Stack direction={{xs: 'column', sm: 'row'}} spacing={3} sx={{mt: 4}}>
        {apps.map(app => (
          <Card key={app.id} sx={{flex: 1}}>
            <CardActionArea href={getNimbusAppUrl(app.id)}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {app.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default Home;
