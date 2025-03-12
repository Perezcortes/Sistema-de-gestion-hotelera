import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Habitaciones from './pages/Habitaciones';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Registro from './pages/Registro'; // Importamos el componente de Registro
import Login from './pages/Login'; // Importamos el componente de Login

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/habitaciones" element={<Habitaciones />} />
      <Route path="/registro" element={<Registro />} /> {/* Ruta para el registro */}
      <Route path="/login" element={<Login />} /> {/* Ruta para el login */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
