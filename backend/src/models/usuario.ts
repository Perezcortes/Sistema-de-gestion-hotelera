// src/models/usuario.ts
export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string,
    public rol: string,
    public fechaRegistro?: string  // opcional 
  ) {}

  loggin(): boolean {
    console.log(`Usuario ${this.nombre} ha iniciado sesión.`);
    return true;
  }
}
