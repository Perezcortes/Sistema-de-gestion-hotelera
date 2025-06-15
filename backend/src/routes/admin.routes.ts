// src/routes/admin.routes.ts
import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';

const router = Router();

router.get('/clientes', adminController.getClientes);
router.post('/usuarios', adminController.registrarUsuario);
router.post('/propuesta-tarifa', adminController.enviarPropuestaTarifa);
router.get('/reservas', adminController.verHistorialReservas);
router.get('/reportes', adminController.generarReporte);

export default router;
