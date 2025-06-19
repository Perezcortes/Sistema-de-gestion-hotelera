import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import { Administrador } from '../models/administrador';
import { Cliente } from '../models/cliente';
import { Incidencia } from '../models/incidencia';
import { Reporte } from '../models/reporte';
import { Recepcionista } from '../models/recepcionista';

export const soporteController = {
  /**
   * Obtiene todas las incidencias con sus reportes asociados
   */
  getIncidencias: async (req: Request, res: Response): Promise<void> => {
    try {
      // Consulta principal para obtener incidencias
      const [incidencias] = await pool.query<RowDataPacket[]>(`
        SELECT * FROM incidencia ORDER BY fecha DESC
      `);

      // Consulta para obtener todos los reportes
      const [reportes] = await pool.query<RowDataPacket[]>(`
        SELECT * FROM reporte ORDER BY id_incidencia
      `);

      // Mapear incidencias con sus reportes
      const resultado = incidencias.map((inc: any) => {
        const incidencia = new Incidencia(
          inc.descripcion,
          inc.fecha,
          inc.prioridad
        );

        return incidencia;
      });

      res.json(resultado);
    } catch (error) {
      console.error('Error al obtener incidencias:', error);
      res.status(500).json({ 
        mensaje: 'Error al obtener incidencias',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  /**
   * Crea una nueva incidencia
   */
  crearIncidencia: async (req: Request, res: Response): Promise<void> => {
    const { descripcion, prioridad } = req.body;

    if (!descripcion) {
      res.status(400).json({ mensaje: 'La descripción es requerida' });
      return;
    }

    try {
      const [result] = await pool.query(`
        INSERT INTO incidencia (descripcion, prioridad)
        VALUES (?, ?)
      `, [descripcion, prioridad || 'media']);

      const insertId = (result as any).insertId;

      const nuevaIncidencia = new Incidencia(
        insertId,
        descripcion,
        new Date().toISOString(),
      );

      res.status(201).json(nuevaIncidencia);
    } catch (error) {
      console.error('Error al crear incidencia:', error);
      res.status(500).json({ 
        mensaje: 'Error al crear incidencia',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  /**
   * Actualiza el estado de una incidencia
   */
  actualizarEstado: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['abierta', 'en_proceso', 'cerrada'].includes(estado)) {
      res.status(400).json({ mensaje: 'Estado no válido' });
      return;
    }

    try {
      await pool.query(`
        UPDATE incidencia SET estado = ? WHERE id = ?
      `, [estado, id]);

      res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ 
        mensaje: 'Error al actualizar estado de la incidencia',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  /**
   * Agrega un reporte a una incidencia
   */
  agregarReporte: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { descripcion } = req.body;

    if (!descripcion) {
      res.status(400).json({ mensaje: 'La descripción del reporte es requerida' });
      return;
    }

    try {
      // Verificar que la incidencia existe
      const [incidencia] = await pool.query<RowDataPacket[]>(`
        SELECT id FROM incidencia WHERE id = ?
      `, [id]);

      if (incidencia.length === 0) {
        res.status(404).json({ mensaje: 'Incidencia no encontrada' });
        return;
      }

      // Crear reporte 
      const [result] = await pool.query(`
        INSERT INTO reporte (id_incidencia, descripcion)
        VALUES (?, ?)
      `, [id, descripcion]);

    } catch (error) {
      console.error('Error al agregar reporte:', error);
      res.status(500).json({ 
        mensaje: 'Error al agregar reporte',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },
};