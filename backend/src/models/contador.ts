// src/models/Contador.ts
import { Tarifa } from './tarifa';

export class Contador {
  evaluarTarifa(tarifa: Tarifa): 'aprobado' | 'rechazado' {
    return Math.random() > 0.5 ? 'aprobado' : 'rechazado';
  }
}
