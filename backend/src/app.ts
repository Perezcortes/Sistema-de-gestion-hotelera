import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; 
import reservasRoutes from './routes/reservas.routes'; 
import perfilRoutes from './routes/perfil.routes'; 
import adminRoutes from './routes/admin.routes'; 
import solicitudRoutes from './routes/Solicitud.route';
import tareaRoutes from './routes/tarea.routes'; 
import habitacionRoutes from './routes/habitacion.routes';
import incidenciaRoutes from './routes/incidencia.routes';
import reporteRoutes from './routes/reporte.routes';
import autorizacionRoutes from './routes/autorizacion.routes';
const app = express();

// Middlewares

app.use(cors({
  origin: 'http://localhost:3000',  // Origen permitido del frontend
  credentials: true,                // Permitir enviar cookies y credenciales
}));

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

//ruta mantenimiento
app.use('/api', solicitudRoutes);
app.use('/api', tareaRoutes);
app.use('/api', habitacionRoutes);

//ruta soporte
app.use('/api/incidencia', incidenciaRoutes);
app.use('/api/reporte', reporteRoutes);
app.use('/api/autorizacion', autorizacionRoutes);

export default app;
