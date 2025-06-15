// src/models/Cliente.ts
export class Cliente {
  constructor(
    public id: number,
    public nombre: string,
    public correo: string,
    public fechaRegistro: string
  ) {}
}
