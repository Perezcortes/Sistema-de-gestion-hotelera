'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
}

const ReportesIncidencias = () => {
  const [reporte, setReporte] = useState<ReporteIncidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const res = await axios.get('/api/soporte/reportes-incidencias');
        setReporte(res.data);
      } catch (err) {
        console.error('Error al obtener reporte:', err);
        setError('Error al cargar el reporte');
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, []);

  const descargarReporte = () => {
    const csvContent = `data:text/csv;charset=utf-8,Mes,Total Incidencias,Resueltas,Pendientes\n${
      reporte.map(r => `${r.mes},${r.total},${r.resueltas},${r.pendientes}`).join('\n')
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
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Reporte Mensual de Incidencias',
        font: { size: 18 },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reporte de Incidencias</h2>
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
              <th className="px-4 py-2 text-left">Total Incidencias</th>
              <th className="px-4 py-2 text-left">Resueltas</th>
              <th className="px-4 py-2 text-left">Pendientes</th>
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
                <td className="px-4 py-2">
                  {Math.round((item.resueltas / item.total) * 100)}%
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