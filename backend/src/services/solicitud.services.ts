// src/services/solicitud.service.ts
import db from '../config/database'; // Asume que 'db' es tu conexión a la base de datos
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ProductoSolicitado, Solicitud, SolicitudDb } from '../models/solicitud.models';

export class SolicitudService {

  // Método para manejar la lógica de borrado e inserción
  public async crearOReemplazarSolicitud(
    userId: number,
    productos: ProductoSolicitado[]
  ): Promise<number> {
    const productosJson = JSON.stringify(productos);

    try {
      // 1. Borrar contenido anterior
      console.log('SolicitudService: Borrando contenido anterior de la tabla "solicitud".');
      await db.execute('DELETE FROM solicitud');

      // 2. Insertar nueva solicitud
      console.log('SolicitudService: Insertando nueva solicitud para el usuario', userId);
      const query = 'INSERT INTO solicitud (usuario, productos_solicitados) VALUES (?, ?)';
      const [result] = await db.execute<ResultSetHeader>(query, [userId, productosJson]);

      return result.insertId;
    } catch (error) {
      console.error('SolicitudService: Error al crear o reemplazar la solicitud:', error);
      throw new Error('No se pudo crear o reemplazar la solicitud.'); // Relanza un error más específico para el controlador
    }
  }

  // Opcional: Si quieres tener un método para obtener la última solicitud
  public async obtenerUltimaSolicitud(): Promise<Solicitud | undefined> {
    console.log('SolicitudService: Intentando obtener la última solicitud.');
    // Asumiendo que la tabla solo tiene una fila o quieres la más reciente si hay varias
    // Por el delete anterior, solo debería haber una.
    const [rows] = await db.execute<RowDataPacket[]>('SELECT id, usuario, productos_solicitados, creada_en FROM solicitud ORDER BY creada_en DESC LIMIT 1');

    if (rows.length === 0) {
      console.log('SolicitudService: No se encontró ninguna solicitud.');
      return undefined;
    }

    const row = rows[0] as SolicitudDb; // Casteamos a SolicitudDb para acceso tipado
    
    // Parsear el JSON de productos
    let productosParsed: ProductoSolicitado[] = [];
    try {
      productosParsed = JSON.parse(row.productos_solicitados);
    } catch (e) {
      console.error('SolicitudService: Error al parsear productos_solicitados JSON:', e);
      // Podrías manejar esto retornando un error o una lista vacía
    }

    // Convertir a tu modelo de Solicitud de aplicación
    const solicitud: Solicitud = {
      id: row.id,
      usuario: row.usuario,
      productos_solicitados: productosParsed,
      creada_en: row.creada_en.toISOString() // Si es un Date objeto de MySQL2
                                              // o row.creada_en si ya es string en el formato deseado
    };
    
    console.log('SolicitudService: Solicitud obtenida:', solicitud);
    return solicitud;
  }
}

// Exporta una instancia del servicio para usar en los controladores
export const solicitudService = new SolicitudService();