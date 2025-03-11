import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Habitaciones from './pages/Habitaciones';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/habitaciones" element={<Habitaciones />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
