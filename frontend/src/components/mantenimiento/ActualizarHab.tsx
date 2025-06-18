import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api2m'; 

interface Habitacion {
    id: number;
    num_habitacion: number;
    descripcion: string;
    estado: string;
}

export default function ActualizarHabitacion() { 
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    //Obtener Habitacion
    const fetchHabitaciones = useCallback(async () => {
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null); 
        try {
            console.log('Frontend: Intentando obtener habitaciones de /api/habitaciones');
            const response = await api.get('/api/habitaciones');
            console.log('Frontend: Habitaciones recibidas:', response.data);
            setHabitaciones(response.data);
        } catch (err: any) {
            console.error('Frontend: Error al obtener habitaciones:', err.response?.data || err.message);
            setErrorMessage(`No se pudieron cargar las habitaciones: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChangeEstado = async (habitacionId: number, nuevoEstado: string, estadoActual: string) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        if (nuevoEstado === 'Disponible') {
            if (estadoActual !== 'En Limpieza' && estadoActual !== 'En Mantenimiento') {
                alert(`Para pasar a 'Disponible', la habitación debe estar en 'En Limpieza' o 'En Mantenimiento'. Actualmente está en '${estadoActual}'.`);
                return;
            }
             alert('Notificación de disponibilidad envíada al recepcionista');
        }

        //if (!window.confirm(`¿Estás seguro de que quieres cambiar el estado de la habitación a "${nuevoEstado}"?`)) {
          //  return;
        //}

        try {
            console.log(`Frontend: Enviando solicitud para actualizar habitación ID ${habitacionId} a estado "${nuevoEstado}"`);
            await api.put(`/api/habitaciones/${habitacionId}/estado`, { nuevoEstado });
            setSuccessMessage(`Estado de la habitación ${habitacionId} actualizado a "${nuevoEstado}".`);
            fetchHabitaciones(); // Recargar la lista para reflejar el cambio
        } catch (err: any) {
            console.error(`Error al actualizar estado de habitación ${habitacionId}:`, err.response?.data || err.message);
            setErrorMessage(`No se pudo actualizar el estado: ${err.response?.data?.message || err.message}`);
        }
    };

    // Cargar habitaciones al montar el componente
    useEffect(() => {
        fetchHabitaciones();
    }, [fetchHabitaciones]);

    return (
        <div className="relative flex flex-col rounded-xl bg-white shadow p-4 bg-cyan-800/50">
            <h2 className="text-xl font-bold mb-4 text-center">Gestión de Habitaciones</h2>

            {errorMessage && (
                <div className="bg-red-100/50 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Error:</p>
                    <p>{errorMessage}</p>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100/50 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Éxito:</p>
                    <p>{successMessage}</p>
                </div>
            )}

            {loading && <div className="text-center p-4">Cargando habitaciones...</div>}

            {!loading && habitaciones.length === 0 && (
                <div className="text-center p-4 text-gray-700">No hay habitaciones registradas.</div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-slate-700 text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">N° Habitación</th>
                            <th className="py-2 px-4 text-left">Descripción</th>
                            <th className="py-2 px-4 text-left">Estado Actual</th>
                            <th className="py-2 px-4 text-center">Nuevo Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habitaciones.map((habitacion) => (
                            <tr key={habitacion.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4 text-slate-800">{habitacion.num_habitacion}</td>
                                <td className="py-2 px-4 text-slate-700">{habitacion.descripcion}</td>
                                <td className="py-2 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${habitacion.estado === 'Disponible' ? 'bg-green-200 text-green-800' : ''}
                                        ${habitacion.estado === 'En Limpieza' ? 'bg-yellow-200 text-yellow-800' : ''}
                                        ${habitacion.estado === 'En Mantenimiento' ? 'bg-red-200 text-red-800' : ''}
                                        ${!['Disponible', 'En Limpieza', 'En Mantenimiento'].includes(habitacion.estado) ? 'bg-gray-200 text-gray-800' : ''}
                                    `}>
                                        {habitacion.estado}
                                    </span>
                                </td>
                                <td className="py-2 px-4 text-center">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <button
                                            onClick={() => handleChangeEstado(habitacion.id, 'En Limpieza', habitacion.estado)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={habitacion.estado === 'En Limpieza'} // Deshabilita si ya está en este estado
                                        >
                                            En Limpieza
                                        </button>
                                        <button
                                            onClick={() => handleChangeEstado(habitacion.id, 'En Mantenimiento', habitacion.estado)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={habitacion.estado === 'En Mantenimiento'} // Deshabilita si ya está en este estado
                                        >
                                            En Mantenimiento
                                        </button>
                                        <button
                                            onClick={() => handleChangeEstado(habitacion.id, 'Disponible', habitacion.estado)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={habitacion.estado === 'Disponible'} // Deshabilita si ya está en este estado
                                        >
                                            Disponible
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}