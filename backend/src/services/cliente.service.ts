// src/services/usuario.service.ts
import pool from '../config/database';
import { Usuario } from '../models/usuario';

export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const [rows] = await pool.query(
    `SELECT id_usuario AS id, nombre, email AS correo, id_rol AS rol, creado_en AS fechaRegistro FROM usuarios`
  );

  return (rows as any[]).map(
    row => new Usuario(row.id, row.nombre, row.correo, mapRol(row.rol), row.fechaRegistro)
  );
};

function mapRol(idRol: number): string {
  switch (idRol) {
    case 1: return 'Cliente';
    case 2: return 'Administrador';
    case 3: return 'Recepcionista';
    case 4: return 'Contador';
    case 5: return 'Mantenimiento';
    case 6: return 'Soporte';
    default: return 'Desconocido';
  }
}
