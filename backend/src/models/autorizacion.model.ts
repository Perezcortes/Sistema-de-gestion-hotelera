// src/models/autorizacion.model.ts
import db from '../config/database';

export async function crearAutorizacion(data: any) {
  const [result] = await db.execute(
    'INSERT INTO autorizacion (id_incidencia, id_soporte, id_administrador, tipo) VALUES (?, ?, ?, ?)',
    [data.id_incidencia, data.id_soporte, data.id_administrador, data.tipo]
  );
  return result;
}