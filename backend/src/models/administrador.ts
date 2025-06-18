// src/models/Administrador.ts
import { Usuario } from './usuario'; 

export class Administrador {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string
  ) {}

  registrarUsuario(usuario: Usuario) {
  }

  generarReporte() {
  }
}
