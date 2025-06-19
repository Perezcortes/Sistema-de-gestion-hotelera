'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReporteIncidencia {
  mes: string;
  total: number;
  resueltas: number;
  pendientes: number;
  altaPrioridad: number;
  mediaPrioridad: number;
  bajaPrioridad: number;
}

// Datos simulados de reporte para incidencias del sistema
const reporteSimulado: ReporteIncidencia[] = [
  { mes: 'Enero', total: 12, resueltas: 8, pendientes: 4, altaPrioridad: 5, mediaPrioridad: 4, bajaPrioridad: 3 },
  { mes: 'Febrero', total: 18, resueltas: 12, pendientes: 6, altaPrioridad: 7, mediaPrioridad: 6, bajaPrioridad: 5 },
  { mes: 'Marzo', total: 10, resueltas: 7, pendientes: 3, altaPrioridad: 4, mediaPrioridad: 3, bajaPrioridad: 3 },
  { mes: 'Abril', total: 15, resueltas: 10, pendientes: 5, altaPrioridad: 6, mediaPrioridad: 5, bajaPrioridad: 4 },
  { mes: 'Mayo', total: 14, resueltas: 11, pendientes: 3, altaPrioridad: 5, mediaPrioridad: 4, bajaPrioridad: 5 },
  { mes: 'Junio', total: 16, resueltas: 13, pendientes: 3, altaPrioridad: 6, mediaPrioridad: 5, bajaPrioridad: 5 },
];

const ReportesIncidencias = () => {
  const [reporte, setReporte] = useState<ReporteIncidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setReporte(reporteSimulado);
    setLoading(false);
  }, []);

  const descargarReporte = () => {
    const csvContent = `data:text/csv;charset=utf-8,Mes,Total Incidencias,Resueltas,Pendientes,Alta Prioridad,Media Prioridad,Baja Prioridad\n${
      reporte.map(r =>
        `${r.mes},${r.total},${r.resueltas},${r.pendientes},${r.altaPrioridad},${r.mediaPrioridad},${r.bajaPrioridad}`
      ).join('\n')
    }`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reporte_incidencias.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-gray-600">Cargando reporte...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const data = {
    labels: reporte.map(r => r.mes),
    datasets: [
      {
        label: 'Total Incidencias',
        data: reporte.map(r => r.total),
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Resueltas',
        data: reporte.map(r => r.resueltas),
        backgroundColor: '#10b981',
      },
      {
        label: 'Pendientes',
        data: reporte.map(r => r.pendientes),
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Alta Prioridad',
        data: reporte.map(r => r.altaPrioridad),
        backgroundColor: '#dc2626',
      },
      {
        label: 'Media Prioridad',
        data: reporte.map(r => r.mediaPrioridad),
        backgroundColor: '#ca8a04',
      },
      {
        label: 'Baja Prioridad',
        data: reporte.map(r => r.bajaPrioridad),
        backgroundColor: '#65a30d',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Reporte Mensual de Incidencias del Sistema', font: { size: 18 } },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reporte de Incidencias del Sistema</h2>
        <button
          onClick={descargarReporte}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Descargar CSV
        </button>
      </div>

      <div className="mb-8">
        <Bar options={options} data={data} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Mes</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Resueltas</th>
              <th className="px-4 py-2 text-left">Pendientes</th>
              <th className="px-4 py-2 text-left">Alta Prioridad</th>
              <th className="px-4 py-2 text-left">Media Prioridad</th>
              <th className="px-4 py-2 text-left">Baja Prioridad</th>
              <th className="px-4 py-2 text-left">Tasa de Resolución</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reporte.map((item) => (
              <tr key={item.mes} className="hover:bg-gray-50">
                <td className="px-4 py-2">{item.mes}</td>
                <td className="px-4 py-2">{item.total}</td>
                <td className="px-4 py-2 text-green-600">{item.resueltas}</td>
                <td className="px-4 py-2 text-red-600">{item.pendientes}</td>
                <td className="px-4 py-2 text-red-700 font-semibold">{item.altaPrioridad}</td>
                <td className="px-4 py-2 text-yellow-700 font-semibold">{item.mediaPrioridad}</td>
                <td className="px-4 py-2 text-green-700 font-semibold">{item.bajaPrioridad}</td>
                <td className="px-4 py-2">
                  {item.total > 0 ? Math.round((item.resueltas / item.total) * 100) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportesIncidencias;
