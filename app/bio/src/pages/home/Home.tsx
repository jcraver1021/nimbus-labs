import {Box, Typography} from '@mui/material';
import {NimbusLinkCard, NimbusPageHeader} from '@nimbus-labs/ui';

function Home() {
  return (
    <Box sx={{p: 4}}>
      <NimbusPageHeader
        breadcrumbs={[{label: 'Bio'}]}
        title="Biology Educational Apps"
      >
        <Typography variant="body1" paragraph>
          Welcome to the Nimbus Labs Biology workspace.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This app uses the @nimbus-labs/deeptime library for evolutionary
          biology visualizations.
        </Typography>
      </NimbusPageHeader>

      <Box sx={{mt: 4}}>
        <Typography variant="h5" gutterBottom>
          Visualizations
        </Typography>
        <NimbusLinkCard
          sx={{maxWidth: 400, mt: 2}}
          to="/timeline"
          titleVariant="h6"
          title="Evolutionary Timeline"
          description="Scroll through deep time to see how arthropod lineages diverged over millions of years."
        />
      </Box>
    </Box>
  );
}

export default Home;
