// src/models/Tarifa.ts
export class Tarifa {
  constructor(public id: number, public descripcion: string, public monto: number) {}

  proponerNuevaTarifa(monto: number) {
    // lógica simulada
    this.monto = monto;
  }
}
