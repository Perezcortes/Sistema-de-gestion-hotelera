// src/components/Navbar.tsx
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "./TopBar";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        {/* Solo el Top Bar */}
        <TopBar />

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="text-blue-600 font-bold text-2xl tracking-wide">
                Hotel <span className="text-gray-800">Paraíso</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              {["Inicio", "Habitaciones", "Servicios", "Galería", "Contacto"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition relative group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
              <Link
                to="/reserva"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition"
              >
                Reservar Ahora
              </Link>
            </div>

            {/* Mobile Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 p-2 rounded-md hover:bg-gray-100 transition"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-6 pt-2 space-y-4 bg-white shadow-md">
            {["Inicio", "Habitaciones", "Servicios", "Galería", "Contacto"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block text-gray-700 font-medium border-b pb-2 border-gray-100 hover:text-blue-600 transition"
              >
                {item}
              </Link>
            ))}
            <Link
              to="/reserva"
              className="block bg-blue-600 text-white text-center py-3 rounded-full hover:bg-blue-700 transition"
            >
              Reservar Ahora
            </Link>
            {/* Aquí podrías repetir parte del menú usuario para móvil si quieres */}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
