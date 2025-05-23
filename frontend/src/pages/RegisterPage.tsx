import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hotelLoginImg from "../assets/hotel-login.jpg";

const RegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!nombre || !email || !username || !password) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Error al registrar");
        return;
      }

      setSuccess("Registro exitoso. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Error al conectar con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-blue-100 px-4 py-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Imagen decorativa solo md+ */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${hotelLoginImg})` }}
        />

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-blue-800 text-center mb-3">
            Crea tu cuenta
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Bienvenido a Hotel All-In
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm text-center">{success}</p>
            )}

            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Usuario"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded transition"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
