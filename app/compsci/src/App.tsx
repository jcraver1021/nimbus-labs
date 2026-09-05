import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ThemeProvider, CssBaseline} from '@mui/material';
import {theme} from './theme';
import Home from './pages/home/Home';
import ArraySort from './pages/sort/ArraySort';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms/sort" element={<ArraySort />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
