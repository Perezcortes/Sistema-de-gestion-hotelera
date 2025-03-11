import mysql from 'mysql2/promise';

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

const testConnection = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('Conectado a MySQL correctamente');
      connection.release();
      return;
    } catch (error) {
      console.error(`Error de conexión a MySQL (intento ${i + 1}/${retries}):`, error.message);
      await new Promise((res) => setTimeout(res, delay)); // Esperar antes de reintentar
    }
  }
  console.error('No se pudo conectar a MySQL después de varios intentos.');
  process.exit(1);
};

export { testConnection };
export default pool;
