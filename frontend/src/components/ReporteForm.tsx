
// 📁 src/components/ReporteForm.tsx
import { useState } from 'react';
import axios from 'axios';

export default function ReporteForm({ id_incidencia, onSubmit }: any) {
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async () => {
    await axios.post('/api/reporte', { id_incidencia, descripcion });
    setDescripcion('');
    onSubmit();
  };

  return (
    <div className="border-t pt-2">
      <textarea
        className="w-full border p-2 mb-2"
        placeholder="Descripción del reporte técnico"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Enviar reporte
      </button>
    </div>
  );
}