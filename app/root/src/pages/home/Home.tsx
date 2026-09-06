import {Box, Stack, Typography} from '@mui/material';
import {
  NimbusLinkCard,
  NimbusPageHeader,
  getNimbusAppUrl,
} from '@nimbus-labs/ui';

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
  {
    id: 'geo' as const,
    name: 'Geo',
    description:
      'A scrollable dive through deep time, reading off the state of the planet layer by layer.',
  },
];

function Home() {
  return (
    <Box sx={{p: 4, maxWidth: 900, mx: 'auto'}}>
      <NimbusPageHeader title="Nimbus Labs">
        <Typography variant="body1" color="text.secondary" paragraph>
          A collection of small educational apps. Pick one below to get started.
        </Typography>
      </NimbusPageHeader>

      <Stack direction={{xs: 'column', sm: 'row'}} spacing={3} sx={{mt: 4}}>
        {apps.map(app => (
          <NimbusLinkCard
            key={app.id}
            sx={{flex: 1}}
            href={getNimbusAppUrl(app.id)}
            title={app.name}
            description={app.description}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default Home;
