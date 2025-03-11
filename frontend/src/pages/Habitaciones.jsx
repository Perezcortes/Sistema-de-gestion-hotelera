import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await axios.get('/api/habitaciones');
        setHabitaciones(response.data);
      } catch (error) {
        console.error('Error fetching habitaciones:', error);
      }
    };

    fetchHabitaciones();
  }, []);

  return (
    <div>
      <h1>Listado de Habitaciones</h1>
      {habitaciones.map((habitacion) => (
        <div key={habitacion.id}>
          <h3>{habitacion.numero}</h3>
          <p>Tipo: {habitacion.tipo}</p>
        </div>
      ))}
    </div>
  );
}

export default Habitaciones;
