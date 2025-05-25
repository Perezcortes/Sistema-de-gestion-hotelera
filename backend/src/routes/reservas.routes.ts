import express from 'express';
import { registrarReserva, obtenerReservas } from '../controllers/reservasController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticateToken, registrarReserva);
router.get('/', authenticateToken, obtenerReservas);

export default router;
