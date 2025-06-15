// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { generarReporteVentas, simularRespuestaContador } from '../utils/simulaciones';
import { obtenerUsuarios } from '../services/cliente.service';
import { obtenerTodasReservas } from '../services/reserva.service';
import { Usuario } from '../models/usuario';
import { Tarifa } from '../models/tarifa';

export const adminController = {
  getUsuarios: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await obtenerUsuarios();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
  },

  registrarUsuario: (req: Request, res: Response): void => {
    const { nombre, correo, rol } = req.body;

    if (!nombre || !correo || !rol) {
      res.status(400).json({ mensaje: 'Faltan datos para registrar usuario' });
      return;
    }

    const nuevoUsuario = new Usuario(
      Date.now(),
      nombre,
      correo,
      rol,
      new Date().toISOString()
    );

    res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevoUsuario });
  },

  enviarPropuestaTarifa: (req: Request, res: Response): void => {
    const { descripcion, monto } = req.body;

    if (!descripcion || !monto) {
      res.status(400).json({ mensaje: 'Faltan datos para la tarifa' });
      return;
    }

    const nuevaTarifa = new Tarifa(Date.now(), descripcion, monto);
    const resultado = simularRespuestaContador(nuevaTarifa);
    res.json({ mensaje: resultado });
  },

  obtenerReservas: async (req: Request, res: Response): Promise<void> => {
    try {
      const reservas = await obtenerTodasReservas();
      res.json(reservas);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      res.status(500).json({ mensaje: 'Error al obtener reservas' });
    }
  },

  generarReporte: (req: Request, res: Response): void => {
    const reporte = generarReporteVentas();
    res.json(reporte);
  },
};
