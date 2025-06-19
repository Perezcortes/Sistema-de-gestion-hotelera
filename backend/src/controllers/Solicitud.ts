// src/controllers/solicitud.controller.ts
import { Request, Response, NextFunction } from 'express';
import { solicitudService } from '../services/solicitud.services'; // Importa el nuevo servicio
import { ProductoSolicitado } from '../models/solicitud.models'; // Importa la interfaz de productos

interface SolicitudRequestBody {
  productos: ProductoSolicitado[];
}

export const crearSolicitud = async (
  req: Request<{}, any, SolicitudRequestBody, {}>,
  res: Response,
): Promise<void> => {
  // Asumiendo que userIdDeMantenimiento es un valor fijo o se obtiene de la autenticación
  const userIdDeMantenimiento = 5; // O req.user.id si tienes autenticación para el usuario de mantenimiento

  const { productos } = req.body;

  // Validaciones
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    res.status(400).json({ message: 'La lista de productos no es válida.' });
    return;
  }

  for (const producto of productos) {
    if (typeof producto.nombre !== 'string' || producto.nombre.trim() === '' ||
        typeof producto.cantidad !== 'number' || producto.cantidad <= 0) {
      res.status(400).json({ message: 'Cada producto debe tener un nombre válido y una cantidad positiva.' });
      return;
    }
    // Opcional: Puedes asignar el userIdDeMantenimiento a cada producto aquí si es necesario
    // producto.userId = userIdDeMantenimiento;
  }

  try {
    // Delegar la lógica de negocio al servicio
    const solicitudId = await solicitudService.crearOReemplazarSolicitud(userIdDeMantenimiento, productos);

    res.status(201).json({
      message: 'Solicitud creada con éxito',
      solicitudId: solicitudId
    });
  } catch (error: any) {
    console.error('Error en el controlador al crear la solicitud:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor al crear la solicitud.' });
  }
};

// Opcional: Un controlador para obtener la última solicitud
export const getUltimaSolicitud = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const solicitud = await solicitudService.obtenerUltimaSolicitud();
    if (!solicitud) {
      res.status(404).json({ message: 'No se encontró ninguna solicitud.' });
      return;
    }
    res.status(200).json(solicitud);
  } catch (error: any) {
    console.error('Error en el controlador al obtener la solicitud:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor al obtener la solicitud.' });
  }
};