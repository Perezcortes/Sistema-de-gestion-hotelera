// incidencia.service.ts
import Incidencia from '../models/incidencia.model';
export const crearIncidencia = (data: any) => Incidencia.create(data);
export const obtenerIncidencias = () => Incidencia.findAll();