import pool from '../config/db.js';

// Obtener todas las habitaciones
export const getHabitaciones = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM habitaciones
      WHERE estado = 'disponible'
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva habitación (ejemplo para admin)
export const createHabitacion = async (req, res) => {
  const { numero_habitacion, tipo, precio } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO habitaciones (numero_habitacion, tipo, precio) VALUES (?, ?, ?)',
      [numero_habitacion, tipo, precio]
    );
    
    res.status(201).json({
      id: result.insertId,
      numero_habitacion,
      tipo,
      precio
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};