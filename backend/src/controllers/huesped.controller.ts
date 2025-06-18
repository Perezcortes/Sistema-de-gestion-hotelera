// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/database";

import { Huesped } from "../models/huesped";
import { Reserva } from "../models/reserva.model";
import { Factura } from "../models/factura";
import { Perfil } from "../models/perfil";
import { Incidencia } from "../models/incidencia";
import { Autenticacion } from "../models/autenticacion";

export const accionesHuesped = (_req: Request, res: Response): void => {

  const huesped = new Huesped("Ejemplo", "ejemplo@gmail.com", "1234567890");
  const reserva: Reserva = {
    nombre: "Juan Pérez",
    email: "juan@example.com",
    telefono: "123456789",
    fechaLlegada: "2025-07-01",
    horaLlegada: "14:00",
    fechaSalida: "2025-07-05",
    horaSalida: "11:00",
    numeroPersonas: 2,
    tipoHabitacion: "doble",
    serviciosExtra: [],
    metodoPago: "tarjeta",
    comentarios: ""
  };
  const factura = new Factura(
    "Juan Pérez",
    "juan@example.com",
    "123456789",
    "Playa Azul",
    "2025-07-01",
    "14:00",
    "2025-07-05",
    "11:00",
    4,
    2,
    "doble",
    ["Spa", "Desayuno"],
    "tarjeta"
  );
  const perfil = new Perfil("Juan Pérez", "juanp", "juan@example.com");
  const incidencia = new Incidencia(1, "Aire acondicionado no funciona", new Date().toISOString());
  const autenticacion = new Autenticacion();

  res.json({
    mensaje: "Modelos simulados correctamente",
    huesped,
    reserva,
    factura,
    perfil,
    incidencia,
    autenticacion
  });
};


export const getPerfil = async (
  req: Request & { user?: { id_usuario: number } },
  res: Response
): Promise<void> => {
  const userId = req.user?.id_usuario;

  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id_usuario, nombre, username, email FROM usuarios WHERE id_usuario = ?",
    [userId]
  );

  const user = rows[0];

  if (!user) {
    res.status(404).json({ message: "Usuario no encontrado" });
    return;
  }

  res.json(user);
};

export const updatePerfil = async (
  req: Request & { user?: { id_usuario: number } },
  res: Response
): Promise<void> => {
  const userId = req.user?.id_usuario;
  const { nombre, username, email } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  if (!nombre || !username || !email) {
    res.status(400).json({ message: "Faltan datos para actualizar" });
    return;
  }

  try {
    const [existing]: any = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE (username = ? OR email = ?) AND id_usuario != ?",
      [username, email, userId]
    );

    if (existing.length > 0) {
      res.status(400).json({ message: "Username o email ya en uso" });
      return;
    }

    await pool.query(
      "UPDATE usuarios SET nombre = ?, username = ?, email = ? WHERE id_usuario = ?",
      [nombre, username, email, userId]
    );

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};

export const getHistorialReservas = async (
  req: Request & { user?: { id_usuario: number } },
  res: Response
): Promise<void> => {
  const userId = req.user?.id_usuario;

  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM reservas WHERE id_usuario = ? ORDER BY creada_en DESC",
    [userId]
  );

  res.json(rows);
};
