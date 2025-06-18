import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id_usuario: number;
        username: string;
        id_rol: number;
        nombre_rol: string;
      };
    }
  }
}

if (!process.env.JWT_SECRET) {
  // Esto detendrá tu servidor si la variable no está configurada,
  // lo cual es deseable para evitar inconsistencias de seguridad.
  console.error('ERROR: JWT_SECRET no está definido en las variables de entorno.');
  process.exit(1);
}

export const authenticateToken = async (
  req: Request,
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta') as any;
    
    // Verificar que el usuario exista en la base de datos
    const [user]: any = await pool.query(
      `SELECT 
        u.id_usuario, 
        u.username,
        COALESCE(u.id_rol, 1) AS id_rol
       FROM usuarios u
       WHERE u.id_usuario = ?`,
      [decoded.id_usuario]
    );

    if (!user[0]) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    req.user = {
      id_usuario: decoded.id_usuario,
      username: decoded.username,
      id_rol: decoded.id_rol,
      nombre_rol: decoded.nombre_rol
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

export const checkRole = (roles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    
    if (!roles.includes(req.user.id_rol)) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
    }
    
    next();
  };
};