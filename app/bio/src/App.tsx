import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Timeline from './pages/timeline/Timeline';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
