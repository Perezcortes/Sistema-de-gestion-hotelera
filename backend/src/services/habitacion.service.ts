// src/services/habitacion.service.ts
import pool from '../config/database';

export const verificarDisponibilidad = async (fechaEntrada: string, fechaSalida: string) => {
  const [habitaciones] = await pool.query(`
    SELECT 
      h.id_habitacion AS id,
      h.tipo,
      h.precio_noche AS precio,
      CASE 
        WHEN r.id_reserva IS NULL THEN 'Disponible'
        ELSE 'Ocupada'
      END AS estado
    FROM habitaciones h
    LEFT JOIN reservas r ON h.id_habitacion = r.id_habitacion
      AND r.fecha_salida > ?
      AND r.fecha_llegada < ?
    GROUP BY h.id_habitacion
    HAVING estado = 'Disponible'
    ORDER BY h.precio_noche ASC
  `, [fechaEntrada, fechaSalida]);

  return habitaciones;
};

export const obtenerTiposHabitacion = async () => {
  const [tipos] = await pool.query(`
    SELECT DISTINCT tipo, precio_noche AS precio 
    FROM habitaciones
    ORDER BY precio_noche
  `);
  return tipos;
};