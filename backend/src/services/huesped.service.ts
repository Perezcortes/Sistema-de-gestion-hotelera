import { Huesped } from "../models/huesped";
import { RowDataPacket } from "mysql2";
import pool from "../config/database";

// huesped.service.ts
export const obtenerHuespedes = async (): Promise<any[]> => {
    return [
      { id: 1, nombre: 'Carlos Martínez', email: 'carlos@email.com' },
      { id: 2, nombre: 'María González', email: 'maria@example.com' },
    ];
  };