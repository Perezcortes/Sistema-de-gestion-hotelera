// backend/src/controllers/reservasController.ts

import { Request, Response } from 'express';
import { crearReserva, obtenerReservasPorUsuario, obtenerReserva } from '../models/reserva';

export const registrarReserva = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_usuario = req.user?.id_usuario;
    if (!id_usuario) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const nuevaReserva = {
      ...req.body,
      id_usuario
    };

    const reservaId = await crearReserva(nuevaReserva);

    res.status(201).json({ message: 'Reserva creada con éxito', reservaId });
  } catch (error) {
    console.error('Error al registrar reserva:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const obtenerReservas = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_usuario = req.user?.id_usuario;
    if (!id_usuario) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const reservas = await obtenerReservasPorUsuario(id_usuario);

    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const obtenerReservaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_reserva = parseInt(req.params.id, 10);
    if (isNaN(id_reserva)) {
      res.status(400).json({ message: 'ID de reserva inválido' });
      return;
    }
    
    const reservas = await obtenerReserva(id_reserva);

    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
