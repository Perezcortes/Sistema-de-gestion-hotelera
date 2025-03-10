import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para probar la conexión
export const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Conectado a MySQL correctamente');
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
    process.exit(1); // Detener la aplicación si falla la conexión
  } finally {
    if (connection) connection.release(); // Liberar la conexión si existe
  }
};

export default pool;