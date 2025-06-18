// backend/src/routes/tareaRoutes.ts
import { Router } from 'express';
import { getTareas, crearTarea, eliminarTarea, reiniciarTareaTiempo } from '../controllers/tarea.controller';

const router = Router();

router.get('/tareas', getTareas);
router.post('/tareas', crearTarea);
router.delete('/tareas/:id', eliminarTarea); 
router.put('/tareas/:id/reiniciar-tiempo', reiniciarTareaTiempo);

export default router;

