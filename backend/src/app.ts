import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('Sistema de Gestión Hotelera - Backend en funcionamiento');
});

export default app;
