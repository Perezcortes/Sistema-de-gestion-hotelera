// reporte.service.ts
import Reporte from '../models/reporte.model';
export const crearReporte = (data: any) => Reporte.create(data);