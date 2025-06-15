import React from 'react';
import { useAuth } from '../context/AuthContext';

const MantenimientoDashboardPage = () => {
  const { user } = useAuth();

  if (!user || user.id_rol !== 5) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Mantenimiento</h1>
      <p>Hola {user.nombre}, desde aquí podrás visualizar y gestionar tareas asignadas por soporte o administración.</p>
    </div>
  );
};

export default MantenimientoDashboardPage;
