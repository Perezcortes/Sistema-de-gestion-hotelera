import React, { useState } from 'react';
import axios from 'axios';

const Registro = () => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = { nombre_usuario, correo, contrasena };

    axios.post('http://localhost:3000/api/auth/registro', datos)
      .then((response) => {
        console.log(response.data);
        alert('Usuario registrado con éxito');
      })
      .catch((error) => {
        console.error(error);
        alert('Error al registrar usuario');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={nombre_usuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Registro;
