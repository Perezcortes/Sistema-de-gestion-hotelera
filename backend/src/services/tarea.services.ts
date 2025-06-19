import db from '../config/database'; 
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Tarea } from '../models/tareaModels';

interface TareaDb extends Tarea, RowDataPacket {
  id: number;
  accion: string;
  time: string | Date ;
}

export class TareaService {

   private getMysqlFormattedUtcTime(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private getIsoFormattedUtcTime(): string {
    return new Date().toISOString();
  }


  public async getAllTareas(): Promise<TareaDb[]> {
    console.log('TareaService: Intentando obtener tareas de la base de datos...');
    const [rows] = await db.execute<TareaDb[]>('SELECT id, accion, time FROM tarea');
    //console.log('TareaService: Resultados de la consulta de tareas (RAW):', rows); 

    const mappedRows = rows.map(row => {
      let timeForFrontend: string;
      if (row.time instanceof Date) {
        timeForFrontend = row.time.toISOString(); 
      } else if (typeof row.time === 'string') {
        timeForFrontend = row.time.replace(' ', 'T') + 'Z';
      } else {
        timeForFrontend = new Date().toISOString(); 
        console.warn(`Tarea con ID ${row.id} tiene un formato de tiempo inesperado:`, row.time);
      }

      return {
        id: row.id,
        accion: row.accion,
        time: timeForFrontend
      } as TareaDb; 
    });

    console.log('TareaService: Resultados de la consulta de tareas (MAPPED):', mappedRows);
    return mappedRows;
  }
  
  public async crearTarea(accion: string): Promise<{ id: number; accion: string; time: string }> {
    const currentTimeForDB = this.getMysqlFormattedUtcTime(); 
    const currentTimeForFrontend = this.getIsoFormattedUtcTime();
    const now = new Date();
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    const currentTimeISO = now.toISOString();

    console.log('TareaService: Intentando crear tarea:', { accion, currentTime });
    const query = 'INSERT INTO tarea (accion, time) VALUES (?, ?)';
    const [result] = await db.execute<ResultSetHeader>(query, [accion, currentTimeForDB]);
    console.log('TareaService: Tarea creada en DB con ID:', result.insertId);
    return { id: result.insertId, accion, time: currentTimeForFrontend };
  
  }


  public async reiniciarTareaTiempo(id: number): Promise<{ success: boolean; newTime?: string }> {
    const currentTimeForDB = this.getMysqlFormattedUtcTime(); 
    const currentTimeForFrontend = this.getIsoFormattedUtcTime(); 

    const now = new Date();
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); 
    const currentTimeISO = now.toISOString();
    console.log(`TareaService: Intentando reiniciar tiempo de tarea con ID: ${id} a ${currentTime}`);
    const query = 'UPDATE tarea SET time = ? WHERE id = ?';
    const [result] = await db.execute<ResultSetHeader>(query, [currentTimeForDB, id]);
    
    if (result.affectedRows === 0) {
      console.log(`TareaService: Tarea con ID ${id} no encontrada o no se pudo actualizar.`);
      return { success: false };
    } else {
      console.log(`TareaService: Tiempo de tarea con ID ${id} reiniciado en la base de datos.`);
      return { success: true, newTime: currentTimeISO };
    }
  }

  public async eliminarTarea(id: number): Promise<boolean> {
    console.log(`TareaService: Intentando eliminar tarea con ID: ${id}`);
    const query = 'DELETE FROM tarea WHERE id = ?';
    const [result] = await db.execute<ResultSetHeader>(query, [id]);

    if (result.affectedRows === 0) {
      console.log(`TareaService: Tarea con ID ${id} no encontrada.`);
      return false;
    } else {
      console.log(`TareaService: Tarea con ID ${id} eliminada de la base de datos.`);
      return true;
    }
  }
}

export const tareaService = new TareaService();