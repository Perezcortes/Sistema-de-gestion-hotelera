import React from 'react';
import { useAuth } from '../context/AuthContext';

const SoporteDashboardPage = () => {
  const { user } = useAuth();

  if (!user || user.id_rol !== 3) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Soporte Técnico</h1>
      <p>Hola {user.nombre}, pronto podrás revisar y dar seguimiento a incidencias técnicas desde aquí.</p>
    </div>
  );
};

export default SoporteDashboardPage;
