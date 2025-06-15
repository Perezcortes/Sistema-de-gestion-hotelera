'use client';
import { useState } from 'react';

const ModuloIncidencias = () => {
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    try {
      setEnviando(true);
      // Simulación del envío de la incidencia
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMensaje('✅ Incidencia enviada correctamente');
      setDescripcion('');
    } catch {
      setError('❌ Error al enviar la incidencia');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reportar Incidencia</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
          rows={5}
          placeholder="Describe la incidencia..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}

        <button
          type="submit"
          disabled={enviando}
          className={`px-4 py-2 rounded text-white transition ${
            enviando
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {enviando ? 'Enviando...' : 'Enviar Incidencia'}
        </button>
      </form>
    </div>
  );
};

export default ModuloIncidencias;
