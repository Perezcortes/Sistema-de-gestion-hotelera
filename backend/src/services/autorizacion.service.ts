
// autorizacion.service.ts
import Autorizacion from '../models/autorizacion.model';
export const crearAutorizacion = (data: any) => Autorizacion.create(data);