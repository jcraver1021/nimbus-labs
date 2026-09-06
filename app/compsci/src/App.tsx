import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ThemeProvider, CssBaseline} from '@mui/material';
import {NimbusErrorBoundary} from '@nimbus-labs/ui';
import {theme} from './theme';
import Home from './pages/home/Home';
import Algorithms from './pages/algorithms/Algorithms';
import ArraySort from './pages/algorithms/sort/ArraySort';
import ArraySearch from './pages/algorithms/search/ArraySearch';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NimbusErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/algorithms/sort" element={<ArraySort />} />
            <Route path="/algorithms/search" element={<ArraySearch />} />
          </Routes>
        </BrowserRouter>
      </NimbusErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
