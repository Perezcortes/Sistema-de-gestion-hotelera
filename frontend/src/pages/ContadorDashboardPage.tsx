import React from 'react';
import { useAuth } from '../context/AuthContext';

const ContadorDashboardPage = () => {
  const { user } = useAuth();

  if (!user || user.id_rol !== 4) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel del Contador</h1>
      <p>Bienvenido, {user.nombre}. Aquí podrás gestionar propuestas de tarifas y revisar reportes contables (próximamente).</p>
    </div>
  );
};

export default ContadorDashboardPage;
