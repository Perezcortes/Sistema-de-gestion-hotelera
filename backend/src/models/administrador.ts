// src/models/Administrador.ts
import { Usuario } from './usuario'; 

export class Administrador {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string
  ) {}

  registrarUsuario(usuario: Usuario) {
    // lógica para registrar usuario
  }

  generarReporte() {
    // lógica para generar reporte
  }
}
