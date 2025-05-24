import express from 'express';
import { registrarReserva } from '../controllers/reservasController';

const router = express.Router();

router.post('/', registrarReserva); 

export default router;
