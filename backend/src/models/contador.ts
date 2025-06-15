// src/models/Contador.ts
import { Tarifa } from './tarifa';

export class Contador {
  revisarTarifa(tarifa: Tarifa): 'aprobado' | 'rechazado' {
    // simulación
    return Math.random() > 0.5 ? 'aprobado' : 'rechazado';
  }
}
