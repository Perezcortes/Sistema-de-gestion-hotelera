import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api2m';

interface Tarea {
    id: number;
    accion: string;
    time: string; 
}

export default function Tareas() {
    const [tareasDB, setTareasDB] = useState<Tarea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reminderMessage, setReminderMessage] = useState<string | null>(null);
    const [activeReminderTareaId, setActiveReminderTareaId] = useState<number | null>(null); 
    const [nuevaTareaAccion, setNuevaTareaAccion] = useState<string>('');

    // console.log('Tareas.tsx se está renderizando');

    const defaultTareas: Tarea[] = [
        { id: -1, accion: 'Limpiar Baños', time: new Date().toISOString() },
        { id: -2, accion: 'Rellenar jabón de manos', time: new Date().toISOString() },
        { id: -3, accion: 'Limpiar área de trabajo', time: new Date().toISOString() },
        { id: -4, accion: 'Solicitar insumos para el día', time: new Date().toISOString() },
        { id: -5, accion: 'Reportar productos Dañadas', time: new Date().toISOString() },
    ];

    const hasFetchedInitially = useRef(false);

    const fetchTareas = useCallback(async () => {
        if (!loading && !hasFetchedInitially.current) {
            setLoading(true);
        }
        setErrorMessage(null);
        console.log('Frontend: Intentando obtener tareas de /api/tareas');
        try {
            const response = await api.get('/api/tareas');
            console.log('Frontend: Tareas recibidas:', response.data);
            setTareasDB(response.data);
            hasFetchedInitially.current = true;
        } catch (err: any) {
            console.error('Frontend: Error al obtener tareas:', err.response?.data || err.message);
            setErrorMessage(`No se pudieron cargar las tareas: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const checkTareaReminders = useCallback(() => {
        const now = new Date();
        const allTareas = [...tareasDB]; 

        if (allTareas.length === 0) {
            if (reminderMessage !== null) {
                setReminderMessage(null);
                setActiveReminderTareaId(null); 
            }
            return;
        }

        let currentReminder: string | null = null;
        let currentReminderTareaId: number | null = null;

        allTareas.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        console.log('Tareas de la DB para recordatorios:', allTareas);

        for (const tarea of allTareas) {
            if (!tarea.time || tarea.id < 0) { 
                continue;
            }
            try {
                const startTime = new Date(tarea.time);
                if (isNaN(startTime.getTime())) {
                    console.warn(`Frontend: La tarea con ID ${tarea.id} tiene un formato de tiempo inválido: ${tarea.time}`);
                    continue;
                }

                const elapsedMs = now.getTime() - startTime.getTime();
                //obtener cuanto tiempo ha pasado
                //const elapsedHours = elapsedMs / (1000 * 60 * 60);
                const elapsedM = elapsedMs / (1000 * 60);
                //aqui damos por prioridad
                if (elapsedM > 2) { 
                    currentReminder = `¡URGENTE! La tarea "${tarea.accion}" lleva bastante más de 2 minutos.`;
                    currentReminderTareaId = tarea.id;
                    break; 
                } else if (elapsedM > 1) {
                    currentReminder = `¡Recordatorio! La tarea "${tarea.accion}" lleva más de 1 minutos.`;
                    currentReminderTareaId = tarea.id;
               }
            } catch (e) {
                console.error("Frontend: Error al procesar la hora de la tarea:", tarea.time, e);
            }
        }

        if (currentReminder !== reminderMessage || currentReminderTareaId !== activeReminderTareaId) {
            setReminderMessage(currentReminder);
            setActiveReminderTareaId(currentReminderTareaId);
        }
    }, [tareasDB, reminderMessage, activeReminderTareaId]); // Añadidas dependencias relevantes

    const handleNuevaTareaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (nuevaTareaAccion.trim() === '') {
            alert('La descripción de la tarea no puede estar vacía.');
            return;
        }

        try {
            const response = await api.post('/api/tareas', { accion: nuevaTareaAccion });
            console.log('Tarea creada exitosamente en el backend:', response.data);
            setNuevaTareaAccion('');
            fetchTareas();
            setErrorMessage(null);
        } catch (err: any) {
            console.error('Error al agregar nueva tarea:', err.response?.data || err.message);
            setErrorMessage(`No se pudo agregar la tarea: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleTareaCompletada = async (tareaId: number) => {
        if (tareaId < 0) {
            alert('Esta es una tarea por defecto y no se puede eliminar.');
            return;
        }

        if (!window.confirm('¿Estás seguro de que quieres marcar esta tarea como completada y eliminarla?')) {
            return;
        }

        try {
            await api.delete(`/api/tareas/${tareaId}`);
            console.log(`Tarea con ID ${tareaId} eliminada del backend.`);
            fetchTareas();
            setErrorMessage(null);
        } catch (err: any) {
            console.error(`Error al eliminar tarea con ID ${tareaId}:`, err.response?.data || err.message);
            setErrorMessage(`No se pudo eliminar la tarea: ${err.response?.data?.message || err.message}`);
        }
    };

    // NUEVA FUNCIÓN: Marcar alerta como vista y reiniciar tiempo de tarea
    const handleMarcarComoVisto = async () => {
        if (activeReminderTareaId === null || activeReminderTareaId < 0) {
            console.warn("No hay una tarea de recordatorio activa para marcar como vista.");
            return;
        }

        try {
            // Llamar al nuevo endpoint para reiniciar el tiempo
            await api.put(`/api/tareas/${activeReminderTareaId}/reiniciar-tiempo`);
            console.log(`Tiempo de tarea con ID ${activeReminderTareaId} reiniciado.`);
            setReminderMessage(null); // Ocultar el mensaje de alerta
            setActiveReminderTareaId(null); // Limpiar el ID de la tarea activa
            fetchTareas(); // Volver a cargar las tareas para que el tiempo actualizado se refleje
            setErrorMessage(null);
        } catch (err: any) {
            console.error(`Error al marcar como visto la tarea con ID ${activeReminderTareaId}:`, err.response?.data || err.message);
            setErrorMessage(`No se pudo marcar la tarea como vista: ${err.response?.data?.message || err.message}`);
        }
    };


    useEffect(() => {
        if (!hasFetchedInitially.current) {
            fetchTareas();
        }

        const intervalId = setInterval(() => {
            checkTareaReminders();
        }, 30 * 1000);

        return () => clearInterval(intervalId);
    }, [fetchTareas, checkTareaReminders]);


    const combinedTareas = [
        ...defaultTareas,
        ...tareasDB.filter(dbTarea => !defaultTareas.some(defTarea => defTarea.id === dbTarea.id))
    ];

    return (
        <div>
            <div className="relative flex flex-col rounded-xl bg-white shadow p-4 bg-cyan-800/50">
                <h2 className="text-xl font-bold mb-4 text-center">Tus Tareas</h2>

                {errorMessage && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error:</p>
                        <p>{errorMessage}</p>
                    </div>
                )}

                {loading && tareasDB.length === 0 && <div className="text-center p-4">Cargando tareas...</div>}

                {reminderMessage && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Recordatorio:</p>
                        <p>{reminderMessage}</p>
                        {/* Botón para marcar como visto */}
                        {activeReminderTareaId && activeReminderTareaId > 0 && ( // Solo si hay una tarea de DB con recordatorio activo
                            <button
                                onClick={handleMarcarComoVisto}
                                className="mt-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                            >
                                Marcar como Visto
                            </button>
                        )}
                    </div>
                )}

                {/* Formulario para agregar nuevas tareas */}
                <form onSubmit={handleNuevaTareaSubmit} className="mb-4 p-2 border border-sky-900/60 rounded-lg bg-sky-900/50">
                    <label htmlFor="nuevaTarea" className="block text-sm font-medium text-gray-950 mb-1 ">
                        Agregar Una Nueva Tarea:
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="nuevaTarea"
                            value={nuevaTareaAccion}
                            onChange={(e) => setNuevaTareaAccion(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm bg-gray-300"
                            placeholder="Ej. Regar plantas"
                        />
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            Agregar
                        </button>
                    </div>
                </form>

                <nav className="flex min-w-[240px] flex-col gap-1 p-2">
                    {combinedTareas.map((tarea) => (
                        <div
                            key={tarea.id}
                            role="button"
                            className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        >
                            <label
                                htmlFor={`tarea-check-${tarea.id}`}
                                className="flex w-full cursor-pointer items-center px-3 py-2"
                            >
                                <div className="inline-flex items-center">
                                    <label className="flex items-center cursor-pointer relative" htmlFor={`tarea-check-${tarea.id}`}>
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                                            id={`tarea-check-${tarea.id}`}
                                            onChange={() => handleTareaCompletada(tarea.id)}
                                        />
                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                                stroke="currentColor" strokeWidth="1">
                                                <path fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"></path>
                                            </svg>
                                        </span>
                                    </label>
                                    <label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor={`tarea-check-${tarea.id}`}>
                                        {tarea.accion}
                                        {/* Solo mostrar la hora de inicio para tareas que vienen de la DB */}
                                        {tarea.id > 0 && tarea.time && (
                                            <span className="ml-2 text-xs text-slate-100">
                                                (Inicio: {new Date(tarea.time).toLocaleTimeString()})
                                            </span>
                                        )}
                                        {tarea.id < 0 && ( // Opcional: indicar que es una tarea por defecto
                                            <span className="ml-2 text-xs text-slate-400">
                                                (Predefinida)
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </label>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}