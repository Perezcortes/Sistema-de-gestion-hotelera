import express from 'express';
import { registrarReserva } from '../controllers/reservasController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.post('/', authenticateToken, registrarReserva);

export default router;
