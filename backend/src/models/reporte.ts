// src/models/Reporte.ts
export class Reporte {
  generarReporteVentas(): object {
    return {
      totalReservas: 57,
      totalIngresos: 35400,
    };
  }

  generarReporteIncidencias(): object {
    return {
      totalIncidencias: 12,
      incidenciasResueltas: 10,
      incidenciasPendientes: 2,
    };
  }
}
