import { Request, Response, NextFunction } from 'express';
import db from '../config/database';



interface SolicitudRequestBody {
  productos: Array<{
    nombre: string;
    cantidad: number;
    userId: number;
  }>;
}

export const crearSolicitud = async (
  req: Request<{}, any, SolicitudRequestBody, {}>, 
  res: Response,
): Promise<void> => {

  const userIdDeMantenimiento = 5; 

  const { productos } = req.body; 

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
  }

  const productosJson = JSON.stringify(productos);

  try {
    await db.execute('DELETE FROM solicitud');
    console.log('Contenido anterior de la tabla "solicitud" borrado.');
    const query = 'INSERT INTO solicitud (usuario, productos_solicitados) VALUES (?, ?)';
    const [result]: any = await db.execute(query, [userIdDeMantenimiento, productosJson]);

    res.status(201).json({
      message: 'Solicitud creada con éxito',
      solicitudId: (result as any).insertId
    });
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};