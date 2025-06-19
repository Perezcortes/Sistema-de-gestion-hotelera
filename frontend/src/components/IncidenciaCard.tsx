//src/components/IncidenciaCard.tsx
import ReporteForm from './ReporteForm';
import AutorizacionForm from './AutorizacionForm';

export default function IncidenciaCard({ incidencia, onReload }: any) {
  return (
    <div className="border rounded-xl p-4 shadow">
      <h2 className="text-lg font-semibold">{incidencia.descripcion}</h2>
      <p>Estado: <strong>{incidencia.estado}</strong></p>
      <p>Prioridad: <strong>{incidencia.prioridad}</strong></p>
      <p>Fecha: {new Date(incidencia.fecha).toLocaleString()}</p>

      <div className="mt-4 space-y-2">
        <ReporteForm id_incidencia={incidencia.id} onSubmit={onReload} />
        <AutorizacionForm id_incidencia={incidencia.id} onSubmit={onReload} />
      </div>
    </div>
  );
}