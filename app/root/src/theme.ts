import {createNimbusTheme} from '@nimbus-labs/ui';

// Indigo: a neutral umbrella color that doesn't compete with any sub-app's
// own accent (compsci's blue, bio's green).
export const theme = createNimbusTheme({
  palette: {
    primary: {main: '#4527a0'},
  },
});
