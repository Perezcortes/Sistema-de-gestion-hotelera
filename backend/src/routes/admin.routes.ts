// src/routes/admin.routes.ts
import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';

const router = Router();

router.get('/usuarios', adminController.getUsuarios);
router.post('/usuarios', adminController.registrarUsuario);
router.post('/propuesta-tarifa', adminController.enviarPropuestaTarifa);
router.get('/reservas', adminController.obtenerReservas);
router.get('/reportes', adminController.generarReporte);

export default router;
