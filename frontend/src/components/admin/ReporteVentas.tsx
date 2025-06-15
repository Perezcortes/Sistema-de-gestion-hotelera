'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Reporte {
  totalVentas: number;
  totalReservas: number;
}

const ReporteVentas = () => {
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/reportes');
        setReporte(response.data);
        setError('');
      } catch (err) {
        setError('Error al obtener el reporte');
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, []);

  if (loading) return <p>Cargando reporte...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-2xl font-bold mb-4">Reporte de Ventas</h2>
      {reporte ? (
        <div className="space-y-2">
          <p><strong>Total de Ventas:</strong> ${reporte.totalVentas.toFixed(2)}</p>
          <p><strong>Total de Reservas:</strong> {reporte.totalReservas}</p>
        </div>
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
};

export default ReporteVentas;
