//Solo recive solicitudes y valida parametros
import { Request, Response, NextFunction } from 'express';
import { tareaService } from '../services/tarea.services'; 

interface CrearTareaRequestBody {
  accion: string;
}


export const reiniciarTareaTiempo = async (
  req: Request<{ id: string }>, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const tareaId = Number(id);

  if (isNaN(tareaId)) {
    res.status(400).json({ message: 'ID de tarea inválido.' });
    return;
  }

  try {
    const result = await tareaService.reiniciarTareaTiempo(tareaId);

    if (!result.success) {
      res.status(404).json({ message: 'Tarea no encontrada o no se pudo actualizar.' });
    } else {
      res.status(200).json({
        message: 'Tiempo de tarea reiniciado con éxito.',
        id: tareaId,
        newTime: result.newTime
      });
    }
  } catch (error: any) {
    console.error(`Error en controlador al reiniciar tiempo de tarea con ID ${id}:`, error);
    res.status(500).json({
      message: 'Error interno del servidor al reiniciar el tiempo de la tarea.',
      error: error.message || 'Error desconocido.'
    });
  }
};

export const getTareas = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tareas = await tareaService.getAllTareas();
    res.status(200).json(tareas);
    console.log('Controlador: Tareas enviadas al frontend exitosamente.');
  } catch (error: any) {
    console.error('Error en controlador al obtener tareas:', error);
    res.status(500).json({
      message: 'Error interno del servidor al obtener tareas. Revisa los logs del backend.',
      error: error.message || 'Error desconocido.'
    });
  }
};

//Para lo de agregarse una nueva tarea
export const crearTarea = async (
  req: Request<{}, any, CrearTareaRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
    const { accion } = req.body;

    if (!accion || typeof accion !== 'string' || accion.trim() === '') {
        res.status(400).json({ message: 'La descripción de la tarea (accion) no puede estar vacía.' });
        return;
    }

    try {
        const nuevaTarea = await tareaService.crearTarea(accion);
        res.status(201).json({
            message: 'Tarea creada con éxito',
            ...nuevaTarea 
        });
    } catch (error: any) {
        console.error('Error en controlador al crear tarea:', error);
        res.status(500).json({
            message: 'Error interno del servidor al crear la tarea.',
            error: error.message || 'Error desconocido.'
        });
    }
};

export const eliminarTarea = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const tareaId = Number(id);

  if (isNaN(tareaId)) {
    res.status(400).json({ message: 'ID de tarea inválido.' });
    return;
  }

  try {
    const success = await tareaService.eliminarTarea(tareaId);

    if (!success) {
      res.status(404).json({ message: 'Tarea no encontrada.' });
    } else {
      res.status(200).json({ message: 'Tarea eliminada con éxito.' });
    }
  } catch (error: any) {
    console.error(`Error en controlador al eliminar tarea con ID ${id}:`, error);
    res.status(500).json({
      message: 'Error interno del servidor al eliminar la tarea.',
      error: error.message || 'Error desconocido.'
    });
  }
};