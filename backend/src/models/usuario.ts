// src/models/Usuario.ts
export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string,
    public rol: 'Administrador' | 'Recepcionista' | 'Contador' | 'Mantenimiento' | 'Soporte'
  ) {}
}
