// reserva.model.ts 
export interface Reserva {
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

interface ReservaConUsuario extends Reserva {
  id_usuario: number;
}

export const nuevaReserva = async (reserva: ReservaConUsuario) => {
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
    } = reserva;

  };