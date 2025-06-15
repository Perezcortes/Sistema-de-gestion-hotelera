'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  fechaRegistro: string;
}

const ClientesTable = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get('/api/admin/clientes');
        setClientes(res.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Lista de Clientes</h2>
      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Nombre</th>
                <th className="border px-4 py-2 text-left">Correo</th>
                <th className="border px-4 py-2 text-left">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{cliente.id}</td>
                  <td className="border px-4 py-2">{cliente.nombre}</td>
                  <td className="border px-4 py-2">{cliente.correo}</td>
                  <td className="border px-4 py-2">
                    {new Date(cliente.fechaRegistro).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientesTable;
