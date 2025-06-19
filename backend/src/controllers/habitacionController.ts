import { Request, Response, NextFunction } from 'express';
import { habitacionService } from '../services/habitacion.service';
import { EstadoHabitacion } from '../models/habitacion.model'; 

export const getHabitaciones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const habitaciones = await habitacionService.getAllHabitaciones();
        res.status(200).json(habitaciones);
    } catch (error: any) {
        console.error('Error en controlador al obtener habitaciones:', error);
        res.status(500).json({
            message: 'Error interno del servidor al obtener las habitaciones.',
            error: error.message
        });
    }
};

export const updateHabitacionEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { nuevoEstado } = req.body; 
    
    
    if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: 'ID de habitación inválido.' });
        return;
    }
    const habitacionId = Number(id);

    //Verificar que nuevo estado es un string
    //VALIDAR QUE SOLO SEA ALGUNO DE LOS TRES POSIBLES ESTADOS
    if (typeof nuevoEstado !== 'string' || !['En Mantenimiento', 'En Limpieza', 'Disponible'].includes(nuevoEstado)) {
        res.status(400).json({ message: 'Estado de habitación inválido o no permitido.' });
        return;
    }
    const estadoTyped = nuevoEstado as EstadoHabitacion; 

    try {
        const result = await habitacionService.updateHabitacionEstado(habitacionId, estadoTyped);

        res.status(200).json({
            message: 'Estado de habitación actualizado con éxito.',
            id: result.id,
            nuevoEstado: result.nuevoEstado
        });
    } catch (error: any) {
        console.error(`Error en controlador al actualizar estado de habitación con ID ${id}:`, error);
        if (error.message.includes('Habitación no encontrada')) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes('Estado no permitido') || error.message.includes('Para pasar a')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({
                message: 'Error interno del servidor al actualizar el estado de la habitación.',
                error: error.message
            });
        }
    }
};