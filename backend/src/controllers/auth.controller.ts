import { Request, Response } from "express";
import pool from "../config/database";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  const { nombre, email, username, password } = req.body;

  if (!nombre || !email || !username || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? OR username = ?",
      [email, username]
    );

    if ((existing as any[]).length > 0) {
      return res.status(409).json({ message: "Correo o usuario ya registrados" });
    }

    // Buscar dinámicamente el id_rol del rol 'cliente'
    const [rolRows] = await pool.query("SELECT id_rol FROM roles WHERE nombre_rol = 'cliente'");
    const rolCliente = (rolRows as any[])[0];

    if (!rolCliente) {
      return res.status(500).json({ message: "Rol 'cliente' no encontrado en la base de datos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (nombre, email, username, password, id_rol) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, username, hashedPassword, rolCliente.id_rol]
    );

    return res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
