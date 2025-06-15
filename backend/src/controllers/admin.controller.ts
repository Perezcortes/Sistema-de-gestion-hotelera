// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { generarReporteVentas, simularRespuestaContador } from '../utils/simulaciones';
import { Cliente } from '../models/cliente';
import { Usuario } from '../models/usuario';
import { Tarifa } from '../models/tarifa';

export const adminController = {
  getClientes: (req: Request, res: Response) => {
    const clientes: Cliente[] = [
      new Cliente(1, 'Juan Pérez', 'juan@correo.com', '2024-06-01'),
      new Cliente(2, 'Ana Torres', 'ana@correo.com', '2024-06-03'),
    ];
    res.json(clientes);
  },

  registrarUsuario: (req: Request, res: Response) => {
    const { nombre, correo, rol } = req.body;
    const nuevoUsuario = new Usuario(Date.now(), nombre, correo, rol);
    // aquí solo simulamos que se guarda
    res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevoUsuario });
  },

  enviarPropuestaTarifa: (req: Request, res: Response) => {
    const { descripcion, monto } = req.body;
    const nuevaTarifa = new Tarifa(Date.now(), descripcion, monto);
    const resultado = simularRespuestaContador(nuevaTarifa);
    res.json({ mensaje: resultado });
  },

  verHistorialReservas: (req: Request, res: Response) => {
    res.json([
      { id: 1, cliente: 'Juan Pérez', fecha: '2024-06-12', habitacion: 105 },
      { id: 2, cliente: 'Ana Torres', fecha: '2024-06-14', habitacion: 204 },
    ]);
  },

  generarReporte: (req: Request, res: Response) => {
    const reporte = generarReporteVentas();
    res.json(reporte);
  },
};
