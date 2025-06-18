// backend/src/routes/solicitudRoutes.ts
import { Router } from 'express';
import { crearSolicitud } from '../controllers/Solicitud';

const router = Router();

// Ruta protegida: solo usuarios autenticados con rol 5 (mantenimiento) pueden crear solicitudes
router.post(
  '/solicitudes', 
  crearSolicitud 
);

export default router;