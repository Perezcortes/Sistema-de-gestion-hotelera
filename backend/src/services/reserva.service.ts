// src/services/reserva.service.ts
import pool from '../config/database';

export const obtenerTodasReservas = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id_reserva AS id,
      nombre AS cliente,
      tipo_habitacion AS habitacion,
      fecha_llegada AS fechaEntrada,
      fecha_salida AS fechaSalida,
      'Confirmada' AS estado  -- Puedes reemplazar por una columna real si la agregas
    FROM reservas
    ORDER BY fecha_llegada DESC
  `);
  return rows;
};
