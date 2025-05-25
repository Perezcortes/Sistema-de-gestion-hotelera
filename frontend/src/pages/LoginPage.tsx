import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import hotelLoginImg from '../assets/hotel-login.jpg';
import NavbarComponent from "../components/Navbar";
import FooterComponent from "../components/Footer";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      // No hace navigate aquí, ya lo hace login() en el contexto
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-yellow-100 px-4 py-8">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
          <div
            className="hidden md:block md:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${hotelLoginImg})` }}
          />
          <div className="w-full md:w-1/2 p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-blue-800 text-center mb-3">Hotel All-In</h1>
            <p className="text-gray-500 text-center mb-6">Bienvenido de nuevo</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <input
                type="text"
                placeholder="Usuario"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded transition"
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => window.location.href = "/register"}
                className="text-blue-600 hover:underline font-medium"
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
