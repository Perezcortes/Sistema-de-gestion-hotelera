'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  fechaReporte: string;
  estado: 'Pendiente' | 'En Proceso' | 'Resuelta';
  prioridad: 'Baja' | 'Media' | 'Alta';
  reportadoPor: string;
}

// Incidencias simuladas sobre problemas del sistema
const incidenciasSimuladas: Incidencia[] = [
  {
    id: 1,
    titulo: 'Error al iniciar sesión',
    descripcion: 'El sistema devuelve un error 500 cuando intento iniciar sesión con usuario válido.',
    fechaReporte: '2025-06-01T08:15:00Z',
    estado: 'Pendiente',
    prioridad: 'Alta',
    reportadoPor: 'Admin',
  },
  {
    id: 2,
    titulo: 'Interfaz se traba en panel de soporte',
    descripcion: 'Al cargar la lista de incidencias, la página se queda congelada indefinidamente.',
    fechaReporte: '2025-06-02T09:00:00Z',
    estado: 'En Proceso',
    prioridad: 'Media',
    reportadoPor: 'Soporte Técnico',
  },
  {
    id: 3,
    titulo: 'No se actualizan estados de incidencias',
    descripcion: 'Cambiar estado no refresca la tabla y no refleja el cambio hasta recargar manualmente.',
    fechaReporte: '2025-06-03T11:30:00Z',
    estado: 'Pendiente',
    prioridad: 'Alta',
    reportadoPor: 'Usuario',
  },
  {
    id: 4,
    titulo: 'Reporte mensual muestra datos incorrectos',
    descripcion: 'Los gráficos y tabla del reporte mensual no coinciden con las incidencias registradas.',
    fechaReporte: '2025-06-04T14:45:00Z',
    estado: 'Resuelta',
    prioridad: 'Media',
    reportadoPor: 'Administrador',
  },
  {
    id: 5,
    titulo: 'Error al descargar CSV en reporte',
    descripcion: 'Al descargar el archivo CSV, el contenido está vacío o mal formateado.',
    fechaReporte: '2025-06-05T10:20:00Z',
    estado: 'Pendiente',
    prioridad: 'Alta',
    reportadoPor: 'Usuario',
  },
];

const IncidenciasTable = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIncidencias(incidenciasSimuladas);
    setLoading(false);
  }, []);

  const actualizarEstado = (id: number, nuevoEstado: string) => {
    setIncidencias(prev =>
      prev.map(inc => inc.id === id ? { ...inc, estado: nuevoEstado as any } : inc)
    );
    Swal.fire('Actualizado', 'El estado de la incidencia fue actualizado.', 'success');
  };

  const resolverIncidencia = async (id: number) => {
    const { value: solucion } = await Swal.fire({
      title: 'Resolver Incidencia',
      input: 'textarea',
      inputLabel: 'Describe la solución aplicada',
      inputPlaceholder: 'Escribe aquí la solución...',
      showCancelButton: true,
    });

    if (solucion) {
      setIncidencias(prev =>
        prev.map(inc => inc.id === id ? { ...inc, estado: 'Resuelta' } : inc)
      );
      Swal.fire('Resuelta', 'La incidencia ha sido marcada como resuelta.', 'success');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Incidencias del Sistema (Simuladas)</h2>
      {loading ? (
        <p>Cargando incidencias...</p>
      ) : incidencias.length === 0 ? (
        <p>No hay incidencias registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Título</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Descripción</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Fecha</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Prioridad</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Reportado por</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {incidencias.map((incidencia) => (
                <tr key={incidencia.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{incidencia.id}</td>
                  <td className="px-4 py-2 font-medium">{incidencia.titulo}</td>
                  <td className="px-4 py-2">{incidencia.descripcion}</td>
                  <td className="px-4 py-2">
                    {new Date(incidencia.fechaReporte).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incidencia.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                      incidencia.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incidencia.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={incidencia.estado}
                      onChange={(e) => actualizarEstado(incidencia.id, e.target.value)}
                      className={`border rounded px-2 py-1 text-sm ${
                        incidencia.estado === 'Pendiente' ? 'bg-gray-100' :
                        incidencia.estado === 'En Proceso' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Resuelta">Resuelta</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">{incidencia.reportadoPor}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => resolverIncidencia(incidencia.id)}
                      className="text-green-600 hover:underline"
                      disabled={incidencia.estado === 'Resuelta'}
                    >
                      Resolver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidenciasTable;
