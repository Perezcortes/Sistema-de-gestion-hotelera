import { ResultSetHeader } from 'mysql2';
import pool from '../config/database';

interface ReservaData {
  nombre: string;
  email: string;
  telefono: string;
  fechaLlegada: string;
  horaLlegada: string;
  fechaSalida: string;
  horaSalida: string;
  numeroPersonas: number;
  tipoHabitacion: string;
  serviciosExtra: any;
  metodoPago: string;
  comentarios: string;
}

interface ReservaConUsuario extends ReservaData {
  id_usuario: number;
}

export const crearReserva = async (reservaData: ReservaConUsuario) => {
  const {
    id_usuario,
    nombre,
    email,
    telefono,
    fechaLlegada,
    horaLlegada,
    fechaSalida,
    horaSalida,
    numeroPersonas,
    tipoHabitacion,
    serviciosExtra,
    metodoPago,
    comentarios
  } = reservaData;

  const [result] = await pool.query<ResultSetHeader>(`
    INSERT INTO reservas (
      id_usuario, nombre, email, telefono, fecha_llegada, hora_llegada, fecha_salida, hora_salida,
      numero_personas, tipo_habitacion, servicios_extra, metodo_pago, comentarios
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id_usuario,
    nombre,
    email,
    telefono,
    fechaLlegada,
    horaLlegada,
    fechaSalida,
    horaSalida,
    numeroPersonas,
    tipoHabitacion,
    JSON.stringify(serviciosExtra),
    metodoPago,
    comentarios  // ← Este valor faltaba
  ]);

  return result.insertId;
};

export const obtenerReservasPorUsuario = async (id_usuario: number) => {
  const [rows] = await pool.query(
    'SELECT * FROM reservas WHERE id_usuario = ? ORDER BY creada_en DESC',
    [id_usuario]
  );
  return rows;
};