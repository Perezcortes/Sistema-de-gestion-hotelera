'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  fechaRegistro: string;
}

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      try {
        // Simulación de eliminación (haz tu endpoint real aquí)
        await axios.delete(`http://localhost:3001/api/admin/usuarios/${id}`);
        Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        fetchUsuarios(); // recargar usuarios
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  const editarUsuario = (usuario: Usuario) => {
    Swal.fire({
      title: 'Función no implementada',
      text: `Formulario para editar a ${usuario.nombre}.`,
      icon: 'info',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Usuarios</h2>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Correo</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Rol</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Fecha Registro</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{usuario.id}</td>
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-2">{usuario.correo}</td>
                  <td className="px-4 py-2">{usuario.rol}</td>
                  <td className="px-4 py-2">
                    {new Date(usuario.fechaRegistro).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => editarUsuario(usuario)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarUsuario(usuario.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
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

export default UsuariosTable;
