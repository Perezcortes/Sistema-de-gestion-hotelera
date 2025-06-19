'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

const IncidenciasTable = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidencias();
  }, []);

  const fetchIncidencias = async () => {
    try {
      const res = await axios.get('/api/soporte/incidencias');
      setIncidencias(res.data);
    } catch (error) {
      console.error('Error al obtener las incidencias:', error);
      Swal.fire('Error', 'No se pudieron cargar las incidencias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await axios.put(`/api/soporte/incidencias/${id}/estado`, { estado: nuevoEstado });
      setIncidencias(prev =>
        prev.map(inc => inc.id === id ? { ...inc, estado: nuevoEstado as any } : inc)
      );
      Swal.fire('Actualizado', 'El estado de la incidencia fue actualizado.', 'success');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  const resolverIncidencia = async (id: number) => {
    const { value: solucion } = await Swal.fire({
      title: 'Resolver Incidencia',
      input: 'textarea',
      inputLabel: 'Describe la solución aplicada',
      inputPlaceholder: 'Escribe aquí la solución...',
      inputAttributes: {
        'aria-label': 'Escribe aquí la solución'
      },
      showCancelButton: true
    });

    if (solucion) {
      try {
        await axios.post(`/api/soporte/incidencias/${id}/resolver`, { solucion });
        Swal.fire('Resuelta', 'La incidencia ha sido marcada como resuelta.', 'success');
        fetchIncidencias();
      } catch (error) {
        console.error('Error al resolver incidencia:', error);
        Swal.fire('Error', 'No se pudo resolver la incidencia.', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Incidencias Reportadas</h2>
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