// src/models/incidencia.model.ts
import db from '../config/database';

export async function crearIncidencia(data: any) {
  const [result] = await db.execute(
    'INSERT INTO incidencia (descripcion, estado, prioridad) VALUES (?, ?, ?)',
    [data.descripcion, data.estado || 'pendiente', data.prioridad || 'media']
  );
  return result;
}

export async function obtenerIncidencias() {
  const [rows] = await db.execute('SELECT * FROM incidencia');
  return rows;
}