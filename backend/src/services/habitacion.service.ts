import db from '../config/database'; 
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Habitacion, HabitacionDb, EstadoHabitacion } from '../models/habitacion.model';

export class HabitacionService {

  private readonly estadosValidos: EstadoHabitacion[] = ['En Mantenimiento', 'En Limpieza', 'Disponible'];

  public async getAllHabitaciones(): Promise<Habitacion[]> {
    console.log('HabitacionService: Intentando obtener todas las habitaciones...');
    const [rows] = await db.execute<HabitacionDb[]>('SELECT id, num_habitacion, descripcion, estado FROM habitacion');
    console.log('HabitacionService: Habitaciones obtenidas:', rows);
    return rows;
  }


  public async updateHabitacionEstado(id: number, nuevoEstado: EstadoHabitacion): Promise<{ id: number; nuevoEstado: EstadoHabitacion }> {
    if (!this.estadosValidos.includes(nuevoEstado)) {
      throw new Error('Estado no permitido. Los estados válidos son: En Mantenimiento, En Limpieza, Disponible.');
    }

    //OBTENER EL ESTADO DE LA HABITACION
    console.log(`HabitacionService: Obteniendo estado actual para habitación ID: ${id}`);
    const [habitacionRows] = await db.execute<HabitacionDb[]>('SELECT estado FROM habitacion WHERE id = ?', [id]);

    if (habitacionRows.length === 0) {
      throw new Error('Habitación no encontrada.');
    }
    const estadoActual = habitacionRows[0].estado;
    console.log(`HabitacionService: Estado actual de habitación ID ${id}: '${estadoActual}'. Nuevo estado deseado: '${nuevoEstado}'.`);


    // PARA VALIDAR QUE DISPONIBLE SOLO SEA DESPUIES DE MANTENIMIENTO O LIMPIEZA
    let esTransicionValida = false;

    if (nuevoEstado === estadoActual) {
      esTransicionValida = true; 
    } else if (nuevoEstado === 'Disponible') {
      if (estadoActual === 'En Limpieza' || estadoActual === 'En Mantenimiento') {
        esTransicionValida = true;
      } else {
        throw new Error(`Para pasar a 'Disponible', la habitación debe estar en 'En Limpieza' o 'En Mantenimiento'. Actualmente está en '${estadoActual}'.`);
      }
    } else if (nuevoEstado === 'En Mantenimiento' || nuevoEstado === 'En Limpieza') {
      esTransicionValida = true;
    }

    if (!esTransicionValida) {
     throw new Error(`Transición de estado de '${estadoActual}' a '${nuevoEstado}' no permitida.`);
    }

    // ACTUALIZAMOS SI SE PUDO
    console.log(`HabitacionService: Realizando actualización de estado para ID ${id} a '${nuevoEstado}'.`);
    const query = 'UPDATE habitacion SET estado = ? WHERE id = ?';
    const [result] = await db.execute<ResultSetHeader>(query, [nuevoEstado, id]);

    //EN CASO DE HBAITACION ELIMINADA
    if (result.affectedRows === 0) {
       throw new Error('No se pudo actualizar el estado de la habitación (0 filas afectadas).');
    }

    console.log(`HabitacionService: Estado de habitación ID ${id} actualizado a '${nuevoEstado}'.`);
    return { id: id, nuevoEstado: nuevoEstado };
  }
}

export const habitacionService = new HabitacionService();