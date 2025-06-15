'use client';
import { useState } from 'react';

const FormularioUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('recepcionista');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!nombre.trim() || !correo.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar formato básico de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError('Correo no válido');
      return;
    }

    try {
      setEnviando(true);
      // Simula llamada al backend con retraso
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setMensaje('✅ Usuario registrado exitosamente');
      setNombre('');
      setCorreo('');
      setPassword('');
      setRol('recepcionista');
    } catch {
      setError('❌ Error al registrar usuario');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={enviando}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          disabled={enviando}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={enviando}
          required
        />
        <select
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          disabled={enviando}
        >
          <option value="recepcionista">Recepcionista</option>
          <option value="contador">Contador</option>
          <option value="soporte">Soporte Técnico</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
        <button
          type="submit"
          disabled={enviando}
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded transition ${
            enviando ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {enviando ? 'Registrando...' : 'Registrar Usuario'}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
      </form>
    </div>
  );
};

export default FormularioUsuario;
