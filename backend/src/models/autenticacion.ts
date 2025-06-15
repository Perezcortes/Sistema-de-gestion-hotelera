// src/models/Autenticacion.ts
export class Autenticacion {
  iniciarSesion(correo: string, contraseña: string): boolean {
    // lógica simulada
    return correo === 'admin@hotel.com' && contraseña === 'admin123';
  }
}
