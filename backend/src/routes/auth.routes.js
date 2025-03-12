const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');
const router = express.Router();

// Ruta para registro de usuarios
router.post('/registro', (req, res) => {
  const { nombre_usuario, correo, contrasena } = req.body;

  bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send('Error al cifrar la contraseña');

    const query = 'INSERT INTO usuarios (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)';
    connection.query(query, [nombre_usuario, correo, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al registrar el usuario');
      }
      res.status(201).send('Usuario registrado');
    });
  });
});

// Ruta para inicio de sesión
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const query = 'SELECT * FROM usuarios WHERE correo = ?';
  connection.query(query, [correo], (err, result) => {
    if (err) return res.status(500).send('Error al consultar la base de datos');
    if (result.length === 0) return res.status(404).send('Usuario no encontrado');

    const usuario = result[0];
    bcrypt.compare(contrasena, usuario.contrasena, (err, isMatch) => {
      if (err) return res.status(500).send('Error al comparar contraseñas');
      if (!isMatch) return res.status(401).send('Contraseña incorrecta');

      // Crear un token JWT
      const token = jwt.sign({ id: usuario.id, nombre_usuario: usuario.nombre_usuario }, 'tu_clave_secreta', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;
