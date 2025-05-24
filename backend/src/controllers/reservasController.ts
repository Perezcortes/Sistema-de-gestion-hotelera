import { Request, Response } from 'express';
import { crearReserva } from '../models/reservaModel';

export const registrarReserva = async (req: Request, res: Response) => {
  try {
    const nuevaReserva = req.body;
    const reservaId = await crearReserva(nuevaReserva);
    res.status(201).json({ message: 'Reserva creada con éxito', reservaId });
  } catch (error) {
    console.error('Error al registrar reserva:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
