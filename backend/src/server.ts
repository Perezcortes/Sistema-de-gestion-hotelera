// server.ts
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🛠️  Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Backend en http://localhost:${PORT}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 JWT configurado`);
});