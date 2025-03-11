import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa el Router
import App from './App.jsx';

// Configuración base de axios
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Agrega BrowserRouter aquí */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
