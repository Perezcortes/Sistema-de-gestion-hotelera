// src/models/Autenticacion.ts
export class Autenticacion {
  
  iniciarSesion(username: string, password: string): boolean {
    return username === 'admin-hotel' && password === '$2b$10$FwzvGAzf0da5pRrO2ZB1jORNBoebeLNP7kEziH9z9Y2VJzN8yG8Ri';
  }

  cerrarSesion(): void {
    console.log('Sesión cerrada');
  }
}
