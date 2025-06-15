import { Request, Response } from "express";
import pool from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";
const JWT_EXPIRES_IN = "1h";

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
    "INSERT INTO usuarios (nombre, username, email, password, id_rol) VALUES (?, ?, ?, ?, ?)",
    [nombre, username, email, hashedPassword, 1] // Siempre asignar rol 1 (cliente)
  );

  res.status(201).json({
    message: "Usuario registrado correctamente",
    id_usuario: result.insertId
  });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Faltan username o password" });
    return;
  }

  const [users]: any = await pool.query(
    `SELECT 
      u.id_usuario, 
      u.nombre, 
      u.username, 
      u.email, 
      u.password, 
      COALESCE(u.id_rol, 1) AS id_rol,
      COALESCE(r.nombre_rol, 'cliente') AS nombre_rol
     FROM usuarios u
     LEFT JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.username = ?`,
    [username]
  );

  if (users.length === 0) {
    res.status(401).json({ message: "Credenciales inválidas" });
    return;
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401).json({ message: "Credenciales inválidas" });
    return;
  }

  const token = jwt.sign(
    {
      id_usuario: user.id_usuario,
      username: user.username,
      id_rol: user.id_rol,
      nombre_rol: user.nombre_rol
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    token,
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      username: user.username,
      email: user.email,
      id_rol: user.id_rol,
      nombre_rol: user.nombre_rol
    }
  });
};

export const getUserProfile = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  if (!req.user?.id_usuario) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  const [rows]: any = await pool.query(
    `SELECT 
      u.id_usuario, 
      u.nombre, 
      u.username, 
      u.email, 
      COALESCE(u.id_rol, 1) AS id_rol,
      COALESCE(r.nombre_rol, 'cliente') AS nombre_rol
     FROM usuarios u
     LEFT JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = ?`,
    [req.user.id_usuario]
  );

  if (!rows[0]) {
    res.status(404).json({ message: "Usuario no encontrado" });
    return;
  }

  res.json(rows[0]);
};