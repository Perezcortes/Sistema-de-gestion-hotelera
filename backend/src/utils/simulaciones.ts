// src/utils/simulaciones.ts
import { Tarifa } from '../models/tarifa';

export function simularRespuestaContador(tarifa: Tarifa): string {
  return Math.random() > 0.5 ? 'Tarifa aprobada' : 'Tarifa rechazada';
}

export function generarReporteVentas() {
  return {
    totalReservas: 87,
    totalIngresos: 71500,
    fechaGeneracion: new Date().toLocaleString(),
  };
}
