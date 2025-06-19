// src/routes/incidencia.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/incidencia.controller';
const router = Router();
router.post('/', controller.crear);
router.get('/', controller.listar);
export default router;