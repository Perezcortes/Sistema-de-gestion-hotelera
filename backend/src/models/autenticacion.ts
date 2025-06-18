// src/models/Autenticacion.ts
export class Autenticacion {
  
  iniciarSesion(correo: string, contraseña: string): boolean {
    return correo === 'admin@hotel.com' && contraseña === 'admin123';
  }
}
