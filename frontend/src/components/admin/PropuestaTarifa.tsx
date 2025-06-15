'use client';
import { useState } from 'react';
import axios from 'axios';

const PropuestaTarifa = () => {
  const [tipoHabitacion, setTipoHabitacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoHabitacion.trim() || !precio.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (isNaN(Number(precio))) {
      setError('El precio debe ser un número válido');
      return;
    }

    try {
      setError('');
      await axios.post('/api/admin/propuesta-tarifa', {
        tipoHabitacion,
        precio: Number(precio),
      });
      setMensaje('Propuesta de tarifa enviada correctamente');
      setTipoHabitacion('');
      setPrecio('');
    } catch (err) {
      setError('Error al enviar la propuesta');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-2xl font-bold mb-4">Enviar Propuesta de Tarifa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          placeholder="Tipo de Habitación"
          value={tipoHabitacion}
          onChange={(e) => setTipoHabitacion(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar Propuesta
        </button>
      </form>
    </div>
  );
};

export default PropuestaTarifa;
