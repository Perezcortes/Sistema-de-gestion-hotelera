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

interface Reporte {
  totalVentas: number;
  totalReservas: number;
  totalServicios: number;
}

const ReporteVentas = () => {
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Simulación de datos
  useEffect(() => {
    const fetchReporteSimulado = () => {
      setLoading(true);
      setTimeout(() => {
        const datosSimulados: Reporte = {
          totalVentas: 12985.5,
          totalReservas: 87,
          totalServicios: 62,
        };
        setReporte(datosSimulados);
        setLoading(false);
        setError('');
      }, 1000); // Simula 1 segundo de carga
    };

    fetchReporteSimulado();
  }, []);

  const descargarCSV = () => {
    if (!reporte) return;

    const csvContent = `data:text/csv;charset=utf-8,
Total de Ventas,Total de Reservas,Total de Servicios
${reporte.totalVentas.toFixed(2)},${reporte.totalReservas},${reporte.totalServicios}
`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reporte_ventas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="text-gray-600">Cargando reporte...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Configuración del gráfico de barras
  const data = {
    labels: ['Ventas (miles)', 'Reservas', 'Servicios'],
    datasets: [
      {
        label: 'Cantidad',
        data: reporte ? [
          reporte.totalVentas / 1000,  // ventas en miles para que sea comparable
          reporte.totalReservas,
          reporte.totalServicios
        ] : [],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'], // Azul, verde, naranja
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
        text: 'Resumen de Ventas (miles), Reservas y Servicios',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            if (context.dataIndex === 0) {
              return `Ventas: ${context.parsed.y.toFixed(2)} mil`;
            }
            if (context.dataIndex === 1) {
              return `Reservas: ${context.parsed.y}`;
            }
            if (context.dataIndex === 2) {
              return `Servicios: ${context.parsed.y}`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reporte de Ventas</h2>
      {reporte ? (
        <>
          <div className="space-y-3 mb-6">
            <p>
              <strong>Total de Ventas:</strong> ${reporte.totalVentas.toFixed(2)}
            </p>
            <p>
              <strong>Total de Reservas:</strong> {reporte.totalReservas}
            </p>
            <p>
              <strong>Total de Servicios:</strong> {reporte.totalServicios}
            </p>

            <button
              onClick={descargarCSV}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Descargar reporte CSV
            </button>
          </div>

          <Bar options={options} data={data} />
        </>
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
};

export default ReporteVentas;
