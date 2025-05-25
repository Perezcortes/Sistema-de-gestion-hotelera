import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/database";

export const getPerfil = async (req: Request & { user?: { id_usuario: number } }, res: Response): Promise<void> => {
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
    // Verificar si username o email ya están en uso por otro usuario
    const [existing]: any = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE (username = ? OR email = ?) AND id_usuario != ?",
      [username, email, userId]
    );

    if (existing.length > 0) {
      res.status(400).json({ message: "Username o email ya en uso" });
      return;
    }

    // Actualizar datos
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

export const getHistorialReservas = async (req: Request & { user?: { id_usuario: number } }, res: Response): Promise<void> => {
  const userId = req.user?.id_usuario;

  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM reservas WHERE id_usuario = ? ORDER BY fecha_reserva DESC",
    [userId]
  );

  res.json(rows);
};
