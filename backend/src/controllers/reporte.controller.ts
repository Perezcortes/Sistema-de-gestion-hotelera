// src/controllers/reporte.controller.ts
import { Request, Response } from 'express';
import * as reporte from '../models/reporte.model';

export const crear = async (req: Request, res: Response) => {
  const result = await reporte.crearReporte(req.body);
  res.status(201).json(result);
};