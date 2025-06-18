// src/models/Administrador.ts
import { Usuario } from './usuario'; 
import { Cliente } from './cliente';
import { Reserva } from './reserva.model';

export class Administrador {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string
  ) {}

  proponerTarifa(): void {
  }

  reportarIncidencia(incidencia: any): void {
  }

  consultarclientes(cliente: Cliente[]): void {
  }
  
  verHistorialReservas(reservas: Reserva[]): void {
  }

  registrarUsuario(usuario: Usuario) {
  }
  
  generarReporteIncidencias(reportes: Report[]): void {
  }
}
