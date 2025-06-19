export class Huesped {
  constructor(
    public nombre: string,
    public email: string,
    public telefono: string
  ) {}

  toString() {
    return `${this.nombre} (${this.email})`;
  }

  actualizarDatos(nuevoNombre: string, nuevoEmail: string) {
    this.nombre = nuevoNombre;
    this.email = nuevoEmail;
  }

}


