import React, { useState } from 'react'; // Importa useState
import { useAuth } from '../../context/AuthContext';

// Define la interfaz para los productos (opcional pero muy recomendable con TypeScript)
interface Producto {
  id: number;
  nombre: string;
  cantidad: number | ''; // Permite string vacío para el input inicial
}

export default function Solicitar() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: '', cantidad: '' } // Estado inicial: una fila vacía
  ]);
  const [loading, setLoading] = useState(false); // Para mostrar un estado de carga
  const [error, setError] = useState<string | null>(null); // Para manejar errores
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Para mensajes de éxito

  if (!user || user.id_rol !== 5) {
    return <div>No autorizado</div>;
  }

  // Función para agregar una nueva fila a la tabla
  const addRow = () => {
    setProductos(prevProductos => [
      ...prevProductos,
      { id: Date.now(), nombre: '', cantidad: '' } // Usar Date.now() como un ID único simple
    ]);
  };

  // Función para eliminar una fila de la tabla
  const removeRow = (idToRemove: number) => {
    setProductos(prevProductos =>
      prevProductos.filter(producto => producto.id !== idToRemove)
    );
  };

  // Función para manejar cambios en los inputs de cada fila
  const handleInputChange = (id: number, field: keyof Producto, value: string | number) => {
    setProductos(prevProductos =>
      prevProductos.map(producto =>
        producto.id === id
          ? { ...producto, [field]: field === 'cantidad' ? (value === '' ? '' : Number(value)) : value }
          : producto
      )
    );
  };

  // Función para enviar la solicitud al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Filtrar productos vacíos y asegurar que la cantidad sea un número válido
    const productosValidos = productos.filter(
      p => p.nombre.trim() !== '' && typeof p.cantidad === 'number' && p.cantidad > 0
    );

    console.log(user.token)
    if (productosValidos.length === 0) {
      setError('Por favor, ingresa al menos un producto válido con su cantidad.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
          
        },
        
        body: JSON.stringify({
          userId: user.id_usuario, 
          productos: productosValidos // Envía la lista de productos válidos
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar la solicitud.');
      }

      const data = await response.json();
      setSuccessMessage('Solicitud enviada con éxito!');
      console.log('Respuesta del backend:', data);
      setProductos([{ id: Date.now(), nombre: '', cantidad: '' }]); // Resetear el formulario

    } catch (err: any) {
      setError(err.message || 'Error de red. Intenta de nuevo.');
      console.error('Error al enviar solicitud:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-8 bg-cyan-900/50">

      {user.nombre && (
        <p className="text-center text-lg text-black mb-4">
          Solicitante:  <span className="font-semibold">{user.username}</span>
        </p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Éxito:</strong>
          <span className="block sm:inline"> {successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto mb-4  ">
          <table className="min-w-full  border border-gray-300 ">
            <thead>
              <tr className="bg-gray-700/40">
                <th className="py-2 px-4 border-b text-left text-gray-900 font-semibold">Producto</th>
                <th className="py-2 px-4 border-b text-left text-gray-900 font-semibold">Cantidad</th>
                <th className="py-2 px-4 border-b text-left text-gray-900 font-semibold"></th>
              </tr>
            </thead>
            <tbody >
              {productos.map((producto, index) => (
                <tr key={producto.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b bg-slate-300">
                    <input
                      type="text"
                      className="w-full p-2 bg-slate-100 border border-gray-400/70 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={producto.nombre}
                      onChange={(e) => handleInputChange(producto.id, 'nombre', e.target.value)}
                      placeholder="Ej. Trapeador"
                      required={index === 0} 
                    />
                  </td>
                  <td className="py-2 px-4 border-b bg-slate-300">
                    <input
                      type="number"
                      className="w-full p-2  bg-slate-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={producto.cantidad}
                      onChange={(e) => handleInputChange(producto.id, 'cantidad', e.target.value)}
                      min="1"
                      placeholder="Ej. 5"
                      required={index === 0} 
                    />
                  </td>
                  <td className="py-2 px-4 border-b bg-slate-300">
                    {productos.length > 1 && ( // Mostrar botón de eliminar 
                      <button
                        type="button"
                        onClick={() => removeRow(producto.id)}
                        className="bg-red-900 text-white px-3 py-1 rounded hover:bg-red-950 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={addRow}
            className="bg-cyan-800/40 text-white px-4 py-2 rounded-lg hover:bg-cyan-900 transition-colors shadow-md"
          >
            ➕ Agregar Producto
          </button>
          <button
            type="submit"
            className="bg-cyan-800/40 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Enviando...' : '📤 Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
}

 //➤📤📨╰┈➤ 
