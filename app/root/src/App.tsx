import {ThemeProvider, CssBaseline} from '@mui/material';
import {NimbusErrorBoundary} from '@nimbus-labs/ui';
import {theme} from './theme';
import Home from './pages/home/Home';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NimbusErrorBoundary>
        <Home />
      </NimbusErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
