import { Request, Response } from 'express';
import { generarReporteVentas, simularRespuestaContador } from '../utils/simulaciones';
import { obtenerUsuarios } from '../services/cliente.service';
import { obtenerTodasReservas } from '../services/reserva.service';

import { Usuario } from '../models/usuario';
import { Tarifa } from '../models/tarifa';
import { Administrador } from '../models/administrador';
import { Autenticacion } from '../models/autenticacion';
import { Cliente } from '../models/cliente';
import { Contador } from '../models/contador';
import { Incidencia } from '../models/incidencia';
import { Reporte } from '../models/reporte';
import { Reserva } from '../models/reserva.model';

(() => {
  const admin = new Administrador(1, 'Admin Ejemplo', 'admin@hotel.com');
  const auth = new Autenticacion();
  const cliente = new Cliente(2, 'Cliente Demo', 'cliente@hotel.com', new Date().toISOString());
  const contador = new Contador();
  const incidencia = new Incidencia(1, 'Fuga de agua en habitación', new Date().toISOString());
  const reporte = new Reporte();
  const nuevaReserva: Reserva = {
    nombre: 'Juan',
    email: 'juan@example.com',
    telefono: '123456789',
    fechaLlegada: '2025-06-20',
    horaLlegada: '15:00',
    fechaSalida: '2025-06-25',
    horaSalida: '12:00',
    numeroPersonas: 2,
    tipoHabitacion: 'Doble',
    serviciosExtra: [],
    metodoPago: 'Tarjeta',
    comentarios: 'Sin comentarios'
  };

  admin.generarReporteIncidencias([]);
  auth.iniciarSesion('admin@hotel.com', 'admin123');
  cliente.nombre;
  contador.evaluarTarifa(new Tarifa(0, 'Simulada', 1000));
  incidencia.descripcion;
  reporte.generarReporteVentas();
})();

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
