// App.jsx
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    axios.get("/api/mensaje")
      .then(res => console.log("Respuesta del backend:", res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Bienvenido al Sistema de Gestión Hotelera eq5</h1>
    </div>
  );
}