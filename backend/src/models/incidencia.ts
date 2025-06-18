// src/models/Incidencia.ts
export class Incidencia {
  constructor(public id: number, public descripcion: string, public fecha: string) {
  }

  reportar(id: number, descripcion: string, fecha: string) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
  }
}
