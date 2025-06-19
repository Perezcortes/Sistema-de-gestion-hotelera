// src/routes/autorizacion.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/autorizacion.controller';
const router = Router();
router.post('/', controller.crear);
export default router;