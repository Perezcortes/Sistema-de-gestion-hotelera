import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; 
import reservasRoutes from './routes/reservas.routes'; 
import perfilRoutes from './routes/perfil.routes'; 
import adminRoutes from './routes/admin.routes'; 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Sistema de Gestión Hotelera - Backend en funcionamiento');
});

// Rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/usuarios', perfilRoutes);

// Rutas del administrador
app.use('/api/admin', adminRoutes);

export default app;
