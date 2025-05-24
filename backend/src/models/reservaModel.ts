import { ResultSetHeader } from 'mysql2';
import pool from '../config/database';

interface ReservaData {
  nombre: string;
  email: string;
  telefono: string;
  fechaLlegada: string;
  horaLlegada: string;
  fechaSalida: string;
  numeroPersonas: number;
  tipoHabitacion: string;
  serviciosExtra: any;
  metodoPago: string;
  comentarios: string;
}

export const crearReserva = async (reservaData: ReservaData) => {
  const {
    nombre,
    email,
    telefono,
    fechaLlegada,
    horaLlegada,
    fechaSalida,
    numeroPersonas,
    tipoHabitacion,
    serviciosExtra,
    metodoPago,
    comentarios
  } = reservaData;

  const [result] = await pool.query<ResultSetHeader>(`
    INSERT INTO reservas (
      nombre, email, telefono, fecha_llegada, hora_llegada, fecha_salida,
      numero_personas, tipo_habitacion, servicios_extra, metodo_pago, comentarios
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    nombre,
    email,
    telefono,
    fechaLlegada,
    horaLlegada,
    fechaSalida,
    numeroPersonas,
    tipoHabitacion,
    JSON.stringify(serviciosExtra),
    metodoPago,
    comentarios
  ]);

  return result.insertId;
};
