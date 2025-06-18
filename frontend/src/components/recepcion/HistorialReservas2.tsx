'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ModalReservas from '../ModalReservas2';

interface Reserva {
  id: number;
  cliente: string;
  habitacion: string;
  fechaEntrada: string;
  fechaSalida: string;
  estado: string;
}

const estadosDisponibles = ['Confirmada', 'Cancelada', 'Pendiente'];

const HistorialReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);

  useEffect(() => {
    fetchReservas();
  }, []);

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

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    const confirmacion = await Swal.fire({
      title: '¿Actualizar estado?',
      text: `¿Deseas cambiar el estado a "${nuevoEstado}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.put(`/api/admin/reservas/${id}/estado`, { estado: nuevoEstado });
        setReservas((prev) =>
          prev.map((res) => (res.id === id ? { ...res, estado: nuevoEstado } : res))
        );
        Swal.fire('Actualizado', 'El estado de la reserva fue actualizado.', 'success');
      } catch (error) {
        console.error('Error al actualizar estado:', error);
        Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 px-6 pt-6">Historial de Reservas</h2>
      {loading ? (
        <p className="px-6 pb-6">Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p className="px-6 pb-6">No hay reservas registradas.</p>
      ) : (
        <div className="overflow-x-auto pb-6">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Habitación</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Entrada</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Salida</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservas.map((reserva) => (
                <tr 
                  key={reserva.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setReservaSeleccionada(reserva);
                    setModalAbierto(true);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.habitacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.fechaEntrada}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reserva.fechaSalida}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="border border-gray-300 rounded px-2 py-1"
                      value={reserva.estado}
                      onChange={(e) => actualizarEstado(reserva.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Evita que el click en el select abra el modal
                    >
                      {estadosDisponibles.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <ModalReservas
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        reservaId={reservaSeleccionada?.id || 0}
      />
    </div>
  );
};

export default HistorialReservas;