'use client';
import { useState } from 'react';
import ClientesTable from '../components/admin/ClientesTable';
import FormularioUsuario from '../components/admin/FormularioUsuario';
import HistorialReservas from '../components/admin/HistorialReservas';
import ModuloIncidencias from '../components/admin/ModuloIncidencias';
import PropuestaTarifa from '../components/admin/PropuestaTarifa';
import ReporteVentas from '../components/admin/ReporteVentas';

const AdminDashboardPage = () => {
  const [moduloActual, setModuloActual] = useState('clientes');

  const renderModulo = () => {
    switch (moduloActual) {
      case 'clientes':
        if (user.id_rol === 2) return <ClientesTable />; // solo admin
        break;
      case 'usuarios':
        if (user.id_rol === 2) return <FormularioUsuario />; // solo admin
        break;
      case 'reservas':
        if (user.id_rol === 2) return <HistorialReservas />; // solo admin
        break;
      case 'incidencias':
        if ([2, 3].includes(user.id_rol)) return <ModuloIncidencias />; // admin y soporte técnico
        break;
      case 'tarifas':
        if (user.id_rol === 2 || user.id_rol === 4) return <PropuestaTarifa />; // admin y contador
        break;
      case 'reportes':
        if (user.id_rol === 2) return <ReporteVentas />; // solo admin
        break;
      default:
        return <div>No tienes acceso a este módulo</div>;
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Administrador</h2>
        <nav className="space-y-2">
          <button className="w-full text-left hover:bg-gray-700 p-2 rounded" onClick={() => setModuloActual('clientes')}>Clientes</button>
          <button className="w-full text-left hover:bg-gray-700 p-2 rounded" onClick={() => setModuloActual('usuarios')}>Registrar Usuario</button>
          <button className="w-full text-left hover:bg-gray-700 p-2 rounded" onClick={() => setModuloActual('tarifas')}>Propuesta de Tarifa</button>
          <button className="w-full text-left hover:bg-gray-700 p-2 rounded" onClick={() => setModuloActual('reservas')}>Historial de Reservas</button>
          <button className="w-full text-left hover:bg-gray-700 p-2 rounded" onClick={() => setModuloActual('incidencias')}>Incidencias</button>
          <button className="w-full text-left hover:bg-gray-700 p-2 rounded" onClick={() => setModuloActual('reportes')}>Reportes</button>
        </nav>
      </aside>

      {/* Contenido del módulo actual */}
      <main className="flex-1 p-6 bg-gray-100">{renderModulo()}</main>
    </div>
  );
};

export default AdminDashboardPage;
