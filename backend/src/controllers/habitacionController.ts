// backend/src/controllers/habitacionController.ts
import { Request, Response, NextFunction } from 'express';
import db from '../config/database'; // Asegúrate de que esta ruta sea correcta

// Interfaz para el tipo de datos de una habitación
interface Habitacion {
    id: number;
    num_habitacion: number;
    descripcion: string;
    estado: string;
}

// Función para obtener todas las habitaciones
export const getHabitaciones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const [rows]: any = await db.execute('SELECT id, num_habitacion, descripcion, estado FROM habitacion');
        res.status(200).json(rows);
    } catch (error: any) {
        console.error('Error al obtener habitaciones:', error);
        res.status(500).json({
            message: 'Error interno del servidor al obtener las habitaciones.',
            error: error.message
        });
    }
};

// Función para actualizar el estado de una habitación
export const updateHabitacionEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params; // El ID de la habitación viene en los parámetros de la URL
    const { nuevoEstado } = req.body; // El nuevo estado viene en el cuerpo de la solicitud

    if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: 'ID de habitación inválido.' });
        return;
    }
    if (!nuevoEstado || typeof nuevoEstado !== 'string') {
        res.status(400).json({ message: 'Estado de habitación inválido.' });
        return;
    }

    const estadosValidos = ['En Mantenimiento', 'En Limpieza', 'Disponible'];
    if (!estadosValidos.includes(nuevoEstado)) {
        res.status(400).json({ message: 'Estado no permitido.' });
        return;
    }

    try {
        // Primero, obtener el estado actual de la habitación
        const [habitacionRows]: any = await db.execute('SELECT estado FROM habitacion WHERE id = ?', [id]);
        if (habitacionRows.length === 0) {
            res.status(404).json({ message: 'Habitación no encontrada.' });
            return;
        }
        const estadoActual = habitacionRows[0].estado;

        // Lógica de validación de transición de estados
        let esTransicionValida = false;
        if (nuevoEstado === 'Disponible') {
            if (estadoActual === 'En Limpieza' || estadoActual === 'En Mantenimiento') {
                esTransicionValida = true;
            } else {
                res.status(400).json({ message: `Para pasar a 'Disponible', la habitación debe estar en 'En Limpieza' o 'En Mantenimiento'. Actualmente está en '${estadoActual}'.` });
                return;
            }
        } else if (nuevoEstado === 'En Mantenimiento' || nuevoEstado === 'En Limpieza') {
            // Se puede pasar a Mantenimiento o Limpieza desde cualquier estado (o casi cualquier estado, aquí no hay restricción)
            esTransicionValida = true;
        } else if (nuevoEstado === estadoActual) {
            // No hay cambio de estado
            esTransicionValida = true; // Consideramos que no hacer un cambio es una "transición" válida
        }


        if (esTransicionValida) {
            const query = 'UPDATE habitacion SET estado = ? WHERE id = ?';
            const [result]: any = await db.execute(query, [nuevoEstado, id]);

            if (result.affectedRows === 0) {
                res.status(500).json({ message: 'No se pudo actualizar el estado de la habitación.' });
            } else {
                res.status(200).json({
                    message: 'Estado de habitación actualizado con éxito.',
                    id: Number(id),
                    nuevoEstado: nuevoEstado
                });
            }
        } else {
             // Este else debería ser inalcanzable si las validaciones anteriores cubren todos los casos.
             // Pero lo dejo como fallback si se añade un estado no manejado en la lógica explícita.
             res.status(400).json({ message: `Transición de estado de '${estadoActual}' a '${nuevoEstado}' no permitida.` });
        }

    } catch (error: any) {
        console.error(`Error al actualizar estado de habitación con ID ${id}:`, error);
        res.status(500).json({
            message: 'Error interno del servidor al actualizar el estado de la habitación.',
            error: error.message
        });
    }
};