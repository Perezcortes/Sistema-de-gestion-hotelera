// src/controllers/incidencia.controller.ts
import { Request, Response } from 'express';
import * as incidencia from '../models/incidencia.model';

export const crear = async (req: Request, res: Response) => {
  const result = await incidencia.crearIncidencia(req.body);
  res.status(201).json(result);
};

export const listar = async (_req: Request, res: Response) => {
  const data = await incidencia.obtenerIncidencias();
  res.json(data);
};