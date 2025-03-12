import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = { correo, contrasena };

    axios.post('http://localhost:3000/api/auth/login', datos)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('token', response.data.token); // Guardamos el token en el localStorage
        alert('Inicio de sesión exitoso');
      })
      .catch((error) => {
        console.error(error);
        alert('Error al iniciar sesión');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;
