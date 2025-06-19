export type EstadoHabitacion = 'En Mantenimiento' | 'En Limpieza' | 'Disponible';

// INTERFAZ DE HABITACION
export interface Habitacion {
  id: number;
  num_habitacion: number;
  descripcion: string;
  estado: EstadoHabitacion; 
}

//PARA EXTRAER EL JSOM
import { RowDataPacket } from 'mysql2';
export interface HabitacionDb extends Habitacion, RowDataPacket {}