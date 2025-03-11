import app from './app.js'; // Importas la aplicación desde app.js
import { testConnection } from './config/db.js';
import 'dotenv/config';


// Configuración inicial
const PORT = process.env.PORT || 5000;

// Probar conexión a DB al iniciar
testConnection();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});