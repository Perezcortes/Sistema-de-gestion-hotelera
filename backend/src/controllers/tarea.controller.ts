// backend/src/controllers/tareaController.ts
import { Request, Response, NextFunction } from 'express'; // Añadido NextFunction
import db from '../config/database';

interface Tarea {
  id: number;
  accion: string;
  time: string; 
}

interface CrearTareaRequestBody {
  accion: string;
}

interface ReiniciarTareaRequestBody {
  id: number; 
}

export const reiniciarTareaTiempo = async (
  req: Request<{ id: string }, any, {}, {}>, // El ID viene como parámetro de la URL
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params; // Capturamos el ID de los parámetros de la URL

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ message: 'ID de tarea inválido.' });
    return;
  }

  try {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato MySQL DATETIME/TIMESTAMP

    console.log(`Intentando reiniciar tiempo de tarea con ID: ${id} a ${currentTime}`);
    const query = 'UPDATE tarea SET time = ? WHERE id = ?';
    const [result]: any = await db.execute(query, [currentTime, id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Tarea no encontrada o no se pudo actualizar.' });
    } else {
      res.status(200).json({
        message: 'Tiempo de tarea reiniciado con éxito.',
        id: Number(id),
        newTime: currentTime
      });
      console.log(`Tiempo de tarea con ID ${id} reiniciado en la base de datos.`);
    }
  } catch (error: any) {
    console.error(`Error al reiniciar tiempo de tarea con ID ${id}:`, error);

    let errorMessage = 'Error desconocido al reiniciar tiempo de tarea.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as any).message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    res.status(500).json({
      message: 'Error interno del servidor al reiniciar el tiempo de la tarea.',
      error: errorMessage
    });
  }
};
// Función para obtener todas las tareas
export const getTareas = async (
  req: Request,
  res: Response,
  next: NextFunction // Añadido NextFunction
): Promise<void> => {
  try {
    console.log('Intentando obtener tareas de la base de datos...');
    // Asegúrate que los nombres de las columnas coincidan exactamente con tu tabla 'tarea'
    const [rows]: any = await db.execute('SELECT id, accion, time FROM tarea');
    console.log('Resultados de la consulta de tareas:', rows);

    const tareas: Tarea[] = rows.map((row: any) => ({
      id: row.id,
      accion: row.accion,
      time: row.time // MySQL2 debería devolver TIMESTAMPs como strings
    }));

    res.status(200).json(tareas);
    console.log('Tareas enviadas al frontend exitosamente.');

  } catch (error: any) {
    console.error('Error FATAL al obtener tareas:', error);

    let errorMessage = 'Error desconocido al obtener tareas.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as any).message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    // Usar next(error) si quieres que un middleware de manejo de errores lo capture,
    // o enviar la respuesta directamente como lo estabas haciendo para un controlador final.
    // Para un controlador final que responde directamente, res.status().json() es común.
    res.status(500).json({
      message: 'Error interno del servidor al obtener tareas. Revisa los logs del backend.',
      error: errorMessage
    });
  }
};

// Función para crear una nueva tarea
export const crearTarea = async (
  req: Request<{}, any, CrearTareaRequestBody, {}>, // Tipado del Request Body
  res: Response,
  next: NextFunction // Añadido NextFunction
): Promise<void> => {
    const { accion } = req.body;
    // Generar el tiempo actual para la tarea
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato MySQL DATETIME/TIMESTAMP

    // Validación básica
    if (!accion || typeof accion !== 'string' || accion.trim() === '') {
        res.status(400).json({ message: 'La descripción de la tarea (accion) no puede estar vacía.' });
        return;
    }

    try {
        console.log('Intentando crear tarea:', { accion, currentTime });
        // La tabla 'tarea' en tu imagen tiene columnas 'id', 'accion', 'time'.
        // Asegúrate de que el INSERT coincida con esas columnas.
        const query = 'INSERT INTO tarea (accion, time) VALUES (?, ?)';
        const [result]: any = await db.execute(query, [accion, currentTime]);
        console.log('Tarea creada en DB:', result);

        res.status(201).json({
            message: 'Tarea creada con éxito',
            id: (result as any).insertId, // ID de la tarea recién insertada
            accion,
            time: currentTime // El tiempo que se guardó
        });
    } catch (error: any) {
        console.error('Error al crear tarea:', error);

        let errorMessage = 'Error desconocido al crear tarea.';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as any).message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        res.status(500).json({
            message: 'Error interno del servidor al crear la tarea.',
            error: errorMessage
        });
    }
};

export const eliminarTarea = async (
  req: Request<{ id: string }>, // El ID viene como parámetro de la URL
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params; // Capturamos el ID de los parámetros de la URL

  if (!id || isNaN(Number(id))) { // Validar que el ID sea un número válido
    res.status(400).json({ message: 'ID de tarea inválido.' });
    return;
  }

  try {
    console.log(`Intentando eliminar tarea con ID: ${id}`);
    const query = 'DELETE FROM tarea WHERE id = ?';
    const [result]: any = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      // Si no se afectó ninguna fila, la tarea no existía
      res.status(404).json({ message: 'Tarea no encontrada.' });
    } else {
      res.status(200).json({ message: 'Tarea eliminada con éxito.' });
      console.log(`Tarea con ID ${id} eliminada de la base de datos.`);
    }
  } catch (error: any) {
    console.error(`Error al eliminar tarea con ID ${id}:`, error);

    let errorMessage = 'Error desconocido al eliminar tarea.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as any).message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    res.status(500).json({
      message: 'Error interno del servidor al eliminar la tarea.',
      error: errorMessage
    });
  }
};