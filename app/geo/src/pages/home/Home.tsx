import {Box, Typography} from '@mui/material';
import {NimbusLinkCard, NimbusPageHeader} from '@nimbus-labs/ui';

function Home() {
  return (
    <Box sx={{p: 4}}>
      <NimbusPageHeader
        breadcrumbs={[{label: 'Geo'}]}
        title="Geology Educational Apps"
      >
        <Typography variant="body1" paragraph>
          Welcome to the Nimbus Labs Geology workspace.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This app uses the @nimbus-labs/deeptime library for the geologic time
          scale and for what the planet was like at each point along it.
        </Typography>
      </NimbusPageHeader>

      <Box sx={{mt: 4}}>
        <Typography variant="h5" gutterBottom>
          Visualizations
        </Typography>
        <NimbusLinkCard
          sx={{maxWidth: 400, mt: 2}}
          to="/dive"
          titleVariant="h6"
          title="A Dive Through Deep Time"
          description="Dig down from today to the formation of Earth, reading off the state of the planet at every division of the geologic time scale."
        />
      </Box>
    </Box>
  );
}

export default Home;
