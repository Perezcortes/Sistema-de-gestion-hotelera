'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Reserva {
  id: number;
  cliente: string;
  habitacion: string;
  fechaEntrada: string;
  fechaSalida: string;
  estado: string;
}

const HistorialReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axios.get('/api/admin/reservas');
        setReservas(res.data);
      } catch (error) {
        console.error('Error al cargar historial de reservas', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Historial de Reservas</h2>
      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Cliente</th>
                <th className="border px-4 py-2">Habitación</th>
                <th className="border px-4 py-2">Entrada</th>
                <th className="border px-4 py-2">Salida</th>
                <th className="border px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="border px-4 py-2">{reserva.cliente}</td>
                  <td className="border px-4 py-2">{reserva.habitacion}</td>
                  <td className="border px-4 py-2">{reserva.fechaEntrada}</td>
                  <td className="border px-4 py-2">{reserva.fechaSalida}</td>
                  <td className="border px-4 py-2">{reserva.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistorialReservas;
