'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ClientesTable from '../components/admin/ClientesTable';
import FormularioUsuario from '../components/admin/FormularioUsuario';
import HistorialReservas from '../components/admin/HistorialReservas';
import ModuloIncidencias from '../components/admin/ModuloIncidencias';
import PropuestaTarifa from '../components/admin/PropuestaTarifa';
import ReporteVentas from '../components/admin/ReporteVentas';

const modules = [
  { key: 'clientes', label: 'Clientes' },
  { key: 'usuarios', label: 'Registrar Usuario' },
  { key: 'tarifas', label: 'Propuesta de Tarifa' },
  { key: 'reservas', label: 'Historial de Reservas' },
  { key: 'incidencias', label: 'Incidencias' },
  { key: 'reportes', label: 'Reportes' },
];

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [moduloActual, setModuloActual] = useState('clientes');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold text-xl">
        Acceso no autorizado. Por favor inicia sesión.
      </div>
    );
  }

  const renderModulo = () => {
    switch (moduloActual) {
      case 'clientes':
        if (user.id_rol === 2) return <ClientesTable />;
        break;
      case 'usuarios':
        if (user.id_rol === 2) return <FormularioUsuario />;
        break;
      case 'reservas':
        if (user.id_rol === 2) return <HistorialReservas />;
        break;
      case 'incidencias':
        if ([2, 3].includes(user.id_rol)) return <ModuloIncidencias />;
        break;
      case 'tarifas':
        if ([2, 4].includes(user.id_rol)) return <PropuestaTarifa />;
        break;
      case 'reportes':
        if (user.id_rol === 2) return <ReporteVentas />;
        break;
      default:
        return <div>No tienes acceso a este módulo</div>;
    }
    return <div>No tienes acceso a este módulo</div>;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 p-6 overflow-y-auto sticky top-0 h-screen">
        <h2 className="text-2xl font-bold mb-8 text-center">Panel Admin</h2>
        <nav className="flex flex-col gap-2">
          {modules.map(({ key, label }) => {
            const allowed =
              (key === 'incidencias' && [2, 3].includes(user.id_rol)) ||
              (key === 'tarifas' && [2, 4].includes(user.id_rol)) ||
              (key !== 'incidencias' && key !== 'tarifas' && user.id_rol === 2);

            if (!allowed) return null;

            return (
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
            );
          })}
        </nav>
      </aside>

      {/* Contenido principal - Modificado */}
      <main className="flex-1 p-6 bg-white h-screen overflow-auto">
        <div className="max-w-full mx-auto h-full">
          {renderModulo()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;