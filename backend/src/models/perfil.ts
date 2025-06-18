export class Perfil {
  constructor(
    public nombre: string,
    public username: string,
    public email: string
  ) {}

  actualizar(nombre: string, username: string, email: string) {
    this.nombre = nombre;
    this.username = username;
    this.email = email;
  }
}