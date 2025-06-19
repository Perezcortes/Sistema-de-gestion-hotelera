// src/routes/reporte.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/reporte.controller';
const router = Router();
router.post('/', controller.crear);
export default router;