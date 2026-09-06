import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ThemeProvider, CssBaseline} from '@mui/material';
import {NimbusErrorBoundary} from '@nimbus-labs/ui';
import {theme} from './theme';
import Home from './pages/home/Home';
import Dive from './pages/dive/Dive';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NimbusErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dive" element={<Dive />} />
          </Routes>
        </BrowserRouter>
      </NimbusErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
