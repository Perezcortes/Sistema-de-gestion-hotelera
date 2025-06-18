// src/models/usuario.ts
export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string,
    public rol: string,
    public fechaRegistro?: string  // opcional 
  ) {}
}
