// backend/src/routes/habitacion.routes.ts
import { Router } from 'express';
import { getHabitaciones, updateHabitacionEstado } from '../controllers/habitacionController';

const router = Router();

router.get('/habitaciones', getHabitaciones);
router.put('/habitaciones/:id/estado', updateHabitacionEstado);

export default router;