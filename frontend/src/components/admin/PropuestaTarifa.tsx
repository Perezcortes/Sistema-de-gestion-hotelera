'use client';
import { useState } from 'react';

const tarifasHabitaciones = [
  {
    tipo: 'Habitación Individual',
    disponibles: '5 de 8',
    precio: '$500/noche',
    descripcion: 'Cama individual, WiFi, TV',
  },
  {
    tipo: 'Habitación Doble',
    disponibles: '8 de 12',
    precio: '$800/noche',
    descripcion: 'Cama matrimonial, WiFi, TV, A/C',
  },
  {
    tipo: 'Suite',
    disponibles: '3 de 5',
    precio: '$1200/noche',
    descripcion: 'Amplio espacio, Jacuzzi, Vista privilegiada',
  },
];

const servicios = [
  { nombre: 'Spa', precio: '$300 por sesión' },
  { nombre: 'Transporte', precio: '$150 por trayecto' },
  { nombre: 'Buffet', precio: '$250 por persona' },
];

const PropuestaTarifa = () => {
  const [tipoHabitacion, setTipoHabitacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!tipoHabitacion.trim() || !precio.trim() || !justificacion.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (isNaN(Number(precio))) {
      setError('El precio debe ser un número válido');
      return;
    }

    try {
      setEnviando(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación
      setMensaje('✅ Propuesta de tarifa enviada correctamente');
      setTipoHabitacion('');
      setPrecio('');
      setJustificacion('');
    } catch {
      setError('❌ Error al enviar la propuesta');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Lista de Tarifas */}
      <div>
        <h2 className="text-3xl font-bold mb-4">Tarifas Actuales</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Habitaciones</h3>
            <ul className="space-y-4">
              {tarifasHabitaciones.map((hab, i) => (
                <li key={i} className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-bold">{hab.tipo}</p>
                  <p>Disponibles: {hab.disponibles}</p>
                  <p>Precio: {hab.precio}</p>
                  <p className="text-gray-600">{hab.descripcion}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mt-6 mb-2">Servicios</h3>
            <ul className="space-y-2">
              {servicios.map((servicio, i) => (
                <li key={i} className="p-3 border rounded bg-white shadow-sm">
                  <span className="font-medium">{servicio.nombre}:</span> {servicio.precio}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Formulario de propuesta */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Enviar Propuesta de Tarifa</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Tipo de Habitación o Servicio"
            value={tipoHabitacion}
            onChange={(e) => setTipoHabitacion(e.target.value)}
            disabled={enviando}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Precio propuesto"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            disabled={enviando}
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Justificación de la propuesta"
            rows={4}
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
            disabled={enviando}
          />
          {error && <p className="text-red-600 mb-2">{error}</p>}
          {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
          <button
            type="submit"
            disabled={enviando}
            className={`w-full py-2 rounded text-white transition ${
              enviando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {enviando ? 'Enviando...' : 'Enviar Propuesta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropuestaTarifa;
