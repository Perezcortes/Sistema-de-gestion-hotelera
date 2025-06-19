//src/pages/soporte/dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import IncidenciaCard from '../components/IncidenciaCard';

export default function SoporteDashboardPage() {
  const [incidencias, setIncidencias] = useState<any[]>([]);

  const cargar = async () => {
    const res = await axios.get('/api/incidencia');
    setIncidencias(res.data);
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Soporte Técnico</h1>
      {incidencias.length === 0 ? (
        <p>No hay incidencias registradas.</p>
      ) : (
        <div className="grid gap-4">
          {incidencias.map((inc) => (
            <IncidenciaCard key={inc.id} incidencia={inc} onReload={cargar} />
          ))}
        </div>
      )}
    </div>
  );
}