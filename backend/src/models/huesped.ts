export class Huesped {
  constructor(
    public nombre: string,
    public email: string,
    public telefono: string
  ) {}

  toString() {
    return `${this.nombre} (${this.email})`;
  }
}
