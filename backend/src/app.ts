import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; 
import reservasRoutes from './routes/reservas.routes'; 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('Sistema de Gestión Hotelera - Backend en funcionamiento');
});

// Rutas de autenticación
app.use('/api/auth', authRoutes); //
app.use('/api/reservas', reservasRoutes); 

export default app;
