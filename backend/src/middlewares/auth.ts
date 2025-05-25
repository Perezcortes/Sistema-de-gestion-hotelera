import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import pool from '../config/database';

interface TokenPayload extends JwtPayload {
  id_usuario: number;
  username: string;
}

export const authenticateToken = async (
  req: Request & { user?: { id_usuario: number; username: string } },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'clave_secreta'
    ) as TokenPayload;

    const [rows]: any = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
      [decoded.id_usuario]
    );

    if (rows.length === 0) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    req.user = {
      id_usuario: decoded.id_usuario,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
