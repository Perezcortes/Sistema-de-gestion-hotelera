import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hotelLoginImg from '../assets/hotel-login.jpg';

// Importa tus componentes Navbar y Footer
import NavbarComponent from "../components/Navbar";
import FooterComponent from "../components/Footer";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    // Aquí iría la lógica real de autenticación
    alert(`Bienvenido, ${username}`);
  };

  return (
    <>
      <NavbarComponent />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-yellow-100 px-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Imagen decorativa */}
          <div
            className="hidden md:block md:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${hotelLoginImg})` }}
          />

          {/* Formulario de login */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-blue-800 text-center mb-2">Hotel All-In</h1>
            <p className="text-gray-500 text-center mb-6">Bienvenido de nuevo</p>

            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

              <input
                type="text"
                placeholder="Usuario"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded transition"
              >
                Iniciar Sesión
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes cuenta?
              <button
                onClick={() => navigate("/register")}
                className="ml-1 text-blue-600 hover:underline font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
};

export default LoginPage;
