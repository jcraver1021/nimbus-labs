import {ThemeProvider, CssBaseline} from '@mui/material';
import {theme} from './theme';
import Home from './pages/home/Home';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}

export default App;
