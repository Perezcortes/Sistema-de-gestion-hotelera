'use client';
import { useState } from 'react';
import axios from 'axios';

const FormularioUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('recepcionista');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/usuarios', {
        nombre,
        correo,
        password,
        rol,
      });
      setMensaje('Usuario registrado exitosamente');
      setNombre('');
      setCorreo('');
      setPassword('');
      setRol('recepcionista');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMensaje('Error al registrar usuario');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full border px-3 py-2 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          className="w-full border px-3 py-2 rounded"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full border px-3 py-2 rounded"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="recepcionista">Recepcionista</option>
          <option value="contador">Contador</option>
          <option value="soporte">Soporte Técnico</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar Usuario
        </button>
        {mensaje && <p className="text-sm text-green-600 mt-2">{mensaje}</p>}
      </form>
    </div>
  );
};

export default FormularioUsuario;
