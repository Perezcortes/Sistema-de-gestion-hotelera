
//src/components/AutorizacionForm.tsx
import { useState } from 'react';
import axios from 'axios';

export default function AutorizacionForm({ id_incidencia, onSubmit }: any) {
  const [tipo, setTipo] = useState('autoriza');
  const [soporteId] = useState(2); // Simulado
  const [adminId] = useState(1);   // Simulado

  const handleSubmit = async () => {
    await axios.post('/api/autorizacion', {
      id_incidencia,
      id_soporte: soporteId,
      id_administrador: adminId,
      tipo
    });
    onSubmit();
  };

  return (
    <div className="border-t pt-2">
      <select
        className="border p-2 mr-2"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="autoriza">Autorizar</option>
        <option value="no autoriza">No autorizar</option>
      </select>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Enviar autorización
      </button>
    </div>
  );
}
