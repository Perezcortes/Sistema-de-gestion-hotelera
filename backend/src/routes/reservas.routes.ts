import express from 'express';
import { registrarReserva, obtenerReservas, obtenerReservaPorId } from '../controllers/reservasController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticateToken, registrarReserva);
router.get('/', authenticateToken, obtenerReservas);
router.get(`/:id`, authenticateToken, obtenerReservaPorId);
export default router;
