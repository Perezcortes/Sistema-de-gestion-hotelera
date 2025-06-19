import pool from "../config/database";

export class Habitacion {
    constructor(
        public id_habitacion: number,
        public tipo: string,
        public precio_noche: string
    ) {}

    static verificarDisponibilidad(fechaEntrada: string, fechaSalida: string): boolean {
        // Implement logic to check availability
        console.log(`Verificando disponibilidad para fechas: ${fechaEntrada} - ${fechaSalida}`);
        return true; // Example return value
      }

    async obtenerTiposHabitacion() {
        const [tipos] = await pool.query(`
            SELECT DISTINCT tipo, precio_noche AS precio 
            FROM habitaciones
            ORDER BY precio_noche
        `);
        return tipos;
    }
}