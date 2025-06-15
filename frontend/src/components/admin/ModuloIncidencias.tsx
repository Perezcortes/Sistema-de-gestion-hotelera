'use client';
import { useState } from 'react';
import axios from 'axios';

const ModuloIncidencias = () => {
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    try {
      setError('');
      // Enviamos la incidencia al backend (simulado)
      await axios.post('/api/admin/incidencias', { descripcion });
      setMensaje('Incidencia enviada correctamente');
      setDescripcion('');
    } catch (err) {
      setError('Error al enviar la incidencia');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Reportar Incidencia</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded mb-3"
          rows={5}
          placeholder="Describe la incidencia"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Enviar Incidencia
        </button>
      </form>
    </div>
  );
};

export default ModuloIncidencias;
