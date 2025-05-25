import { Request, Response } from "express";
import pool from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";
const JWT_EXPIRES_IN = "1h";

// Registro de usuario
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { nombre, username, email, password } = req.body;

  if (!nombre || !username || !email || !password) {
    res.status(400).json({ message: "Faltan datos obligatorios" });
    return;
  }

  const [existingUsers]: any = await pool.query(
    "SELECT id_usuario FROM usuarios WHERE username = ? OR email = ?",
    [username, email]
  );

  if (existingUsers.length > 0) {
    res.status(400).json({ message: "Usuario o email ya registrado" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result]: any = await pool.query(
    "INSERT INTO usuarios (nombre, username, email, password) VALUES (?, ?, ?, ?)",
    [nombre, username, email, hashedPassword]
  );

  res.status(201).json({ message: "Usuario registrado correctamente", id_usuario: result.insertId });
};

// Login de usuario
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Faltan username o password" });
    return;
  }

  const [users]: any = await pool.query(
    "SELECT id_usuario, nombre, username, email, password FROM usuarios WHERE username = ?",
    [username]
  );

  const user = users[0];

  if (!user) {
    res.status(401).json({ message: "Credenciales inválidas" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Credenciales inválidas" });
    return;
  }

  const token = jwt.sign(
    { id_usuario: user.id_usuario, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Eliminar password antes de enviar el usuario
  delete user.password;

  res.json({ token, user });
};

// Obtener perfil del usuario autenticado
export const getUserProfile = async (req: Request & { user?: { id_usuario: number } }, res: Response): Promise<void> => {
  const userId = req.user?.id_usuario;

  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  const [rows]: any = await pool.query(
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
