import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ThemeProvider, CssBaseline} from '@mui/material';
import {NimbusErrorBoundary} from '@nimbus-labs/ui';
import {theme} from './theme';
import Home from './pages/home/Home';
import Timeline from './pages/timeline/Timeline';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NimbusErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<Timeline />} />
          </Routes>
        </BrowserRouter>
      </NimbusErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
