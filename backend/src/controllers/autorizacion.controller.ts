// src/controllers/autorizacion.controller.ts
import { Request, Response } from 'express';
import * as autorizacion from '../models/autorizacion.model';

export const crear = async (req: Request, res: Response) => {
  const result = await autorizacion.crearAutorizacion(req.body);
  res.status(201).json(result);
};