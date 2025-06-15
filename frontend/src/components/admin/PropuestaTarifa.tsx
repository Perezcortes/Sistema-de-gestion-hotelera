'use client';
import { useState } from 'react';

const PropuestaTarifa = () => {
  const [tipoHabitacion, setTipoHabitacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMensaje('');
    setError('');

    if (!tipoHabitacion.trim() || !precio.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (isNaN(Number(precio))) {
      setError('El precio debe ser un número válido');
      return;
    }

    try {
      setEnviando(true);
      // Simula petición al backend con retraso
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMensaje('✅ Propuesta de tarifa enviada correctamente');
      setTipoHabitacion('');
      setPrecio('');
    } catch {
      setError('❌ Error al enviar la propuesta');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Enviar Propuesta de Tarifa</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Tipo de Habitación"
          value={tipoHabitacion}
          onChange={(e) => setTipoHabitacion(e.target.value)}
          disabled={enviando}
        />
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          disabled={enviando}
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
        <button
          type="submit"
          disabled={enviando}
          className={`px-4 py-2 rounded text-white transition ${
            enviando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {enviando ? 'Enviando...' : 'Enviar Propuesta'}
        </button>
      </form>
    </div>
  );
};

export default PropuestaTarifa;
