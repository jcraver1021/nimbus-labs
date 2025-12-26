import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import ArraySort from './pages/a_sort/ArraySort';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/algorithms/sort" element={<ArraySort />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
