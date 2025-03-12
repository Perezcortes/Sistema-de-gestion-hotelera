import express from 'express';
import cors from 'cors';
import habitacionesRoutes from './routes/habitaciones.routes.js';
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/habitaciones', habitacionesRoutes);
app.use(bodyParser.json()); // Usamos body-parser para manejar los datos JSON

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Hotelera - Backend');
});

// Ruta de healthcheck para Docker Compose
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'El servidor está funcionando correctamente' });
});

export default app;
