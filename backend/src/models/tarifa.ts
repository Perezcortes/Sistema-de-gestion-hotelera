// src/models/Tarifa.ts
export class Tarifa {
  constructor(public id: number, public descripcion: string, public monto: number) {}

  proponerNuevaTarifa(monto: number) {
    this.monto = monto;
  }
}
