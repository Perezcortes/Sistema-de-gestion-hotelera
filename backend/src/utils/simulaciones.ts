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

export function generarReporteHuespedes() {
  return {
    totalHuespedes: 150,
    fechaGeneracion: new Date().toLocaleString(),
    detalles: [
      { nombre: 'Carlos Martínez', fechaLlegada: '2025-06-19', fechaSalida: '2025-06-25' },
      { nombre: 'Ana López', fechaLlegada: '2025-06-20', fechaSalida: '2025-06-22' },
    ],
  };
}

export function simularCheckInOut() {
  return {
    checkIn: '2025-06-20 14:00',
    checkOut: '2025-06-22 11:00',
    estado: Math.random() > 0.5 ? 'Check-in exitoso' : 'Check-out exitoso',
  };
}
