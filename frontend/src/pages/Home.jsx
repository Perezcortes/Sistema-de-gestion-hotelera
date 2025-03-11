import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Bienvenido al Sistema de Gestión Hotelera</h1>
      <Link to="/habitaciones">Ver habitaciones</Link>
    </div>
  );
}

export default Home;
