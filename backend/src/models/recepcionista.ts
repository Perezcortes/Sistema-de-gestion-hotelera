import { Reserva } from './reserva.model';

export class Recepcionista {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string
  ) {}

  registrarReserva(nuevaReserva: Reserva) {
  }

  generarReporte() {
  }

}
