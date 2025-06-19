import { Request, Response } from "express";

import { obtenerTodasReservas } from '../services/reserva.service';
import { obtenerUsuarios } from "../services/cliente.service";
import { crearReserva, obtenerReserva } from "../models/reserva";
import { verificarDisponibilidad } from "../services/habitacion.service";

import { Recepcionista } from '../models/recepcionista';
import { Huesped } from "../models/huesped";
import { Factura } from "../models/factura";
import { Perfil } from "../models/perfil";
import { Reserva } from '../models/reserva.model';


(() => {
  const recepcionista = new Recepcionista(1, 'Ana López', 'recepcion@hotel.com');
  const huesped = new Huesped('María González','maria@example.com','555-987654');  
  const factura = new Factura('Carlos Martínez','carlos@email.com','555-1234567','Hotel Paradisíaco','2025-06-20','15:00','2025-06-25','11:00',5,2,'Suite Deluxe',['SPA', 'Desayuno'],'Tarjeta de crédito','Por favor, habitación alta y silenciosa',1250.75);
  const perfil = new Perfil('Ana López','analopez','ana@hotel.com');  
  const Reserva: Reserva = {
    nombre: 'María González',
    email: 'maria@example.com',
    telefono: '987654321',
    fechaLlegada: '2025-06-20',
    horaLlegada: '14:00',
    fechaSalida: '2025-06-22',
    horaSalida: '11:00',
    numeroPersonas: 1,
    tipoHabitacion: 'Individual',
    serviciosExtra: ['Desayuno'],
    metodoPago: 'Efectivo',
    comentarios: 'Llegará tarde'
  };

  // Simulación de operaciones
  perfil.actualizar('Ana López Actualizada', 'analopez_actualizada', 'ana_actualizada@hotel.com');
  recepcionista.registrarReserva(Reserva);
  huesped.actualizarDatos('Carlos Martínez Jr.', 'carlos.jr@email.com');
  factura.generarResumen();

})();

export const recepcionistaController = {
  // Obtener lista de huéspedes activos
  getHuespedes: async (req: Request, res: Response): Promise<void> => {
    try {
      const huespedes = await obtenerUsuarios();
      res.json(huespedes);
    } catch (error) {
      console.error('Error al obtener huéspedes:', error);
      res.status(500).json({ mensaje: 'Error al obtener huéspedes' });
    }
  },


  // Obtener todas las reservas
  obtenerReservas: async (req: Request, res: Response): Promise<void> => {
    try {
      const reservas = await obtenerTodasReservas();
      res.json(reservas);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      res.status(500).json({ mensaje: 'Error al obtener reservas' });
    }
  },
  // Obtener los datos de la reserva por idreserva
  obtenerReservasPorIdReserva: async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id_usuario;
    try {
      const reservas = await obtenerReserva(1);
      res.json(reservas);
    } catch (error) {
      console.error('Error al obtener reservas del usuario:', error);
      res.status(500).json({ mensaje: 'Error al obtener reservas del usuario' });
    }
  },

  // generar factura
  generarFactura: async (req: Request, res: Response): Promise<void> => {
    const { id_reserva } = req.body;

    if (!id_reserva) {
      res.status(400).json({ mensaje: 'Falta el ID de la reserva' });
      return;
    }

    try {
      const factura = await crearReserva(id_reserva);
      res.json(factura);
    } catch (error) {
      console.error('Error al generar factura:', error);
      res.status(500).json({ mensaje: 'Error al generar factura' });
    }
  },

  // Verificar disponibilidad de habitaciones
  verificarDisponibilidad: async (req: Request, res: Response): Promise<void> => {
    const { fechaEntrada, fechaSalida } = req.body;
    
    if (!fechaEntrada || !fechaSalida) {
      res.status(400).json({ mensaje: 'Faltan datos para verificar disponibilidad' });
      return;
    }

    try {
      const habitacionesDisponibles = await verificarDisponibilidad(fechaEntrada, fechaSalida) as any[];
      
      if (Array.isArray(habitacionesDisponibles) && habitacionesDisponibles.length === 0) {
        res.json({ 
          mensaje: 'No hay habitaciones disponibles para las fechas seleccionadas',
          disponibilidad: false,
          habitaciones: []
        });
      } else {
        res.json({
          mensaje: 'Habitaciones disponibles encontradas',
          disponibilidad: true,
          habitaciones: habitacionesDisponibles
        });
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      res.status(500).json({ mensaje: 'Error al verificar disponibilidad' });
    }
  }
};
