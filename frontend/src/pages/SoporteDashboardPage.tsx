'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import IncidenciasTable from '../components/IncidenciasTable';
import ReportesIncidencias from '../components/ReportesIncidencias';

const modules = [
  { key: 'incidencias', label: 'Incidencias' },
  { key: 'reportes', label: 'Reportes' },
];

const SoporteDashboardPage = () => {
  const { user } = useAuth();
  const [moduloActual, setModuloActual] = useState('incidencias');

  if (!user || user.id_rol !== 3) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold text-xl">
        Acceso no autorizado. Por favor inicia sesión.
      </div>
    );
  }
 
  const renderModulo = () => {
    switch (moduloActual) {
      case 'incidencias':
        return <IncidenciasTable />;
      case 'reportes':
        return <ReportesIncidencias />;
      default:
        return <div>No tienes acceso a este módulo</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 p-6 overflow-y-auto sticky top-0 h-screen">
        <h2 className="text-2xl font-bold mb-8 text-center">Panel Soporte</h2>
        <nav className="flex flex-col gap-2">
          {modules.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setModuloActual(key)}
              className={`w-full text-left rounded px-4 py-2 transition 
                ${moduloActual === key
                  ? 'bg-blue-600 font-medium'
                  : 'hover:bg-gray-700'
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-white h-screen overflow-auto">
        <div className="max-w-full mx-auto h-full">
          <h1 className="text-2xl font-bold mb-6">
            {modules.find(m => m.key === moduloActual)?.label}
          </h1>
          {renderModulo()}
        </div>
      </main>
    </div>
  );
};

export default SoporteDashboardPage;
