import React, { useState } from "react";
import {
  Menu,
  X,
  Phone,
  MapPin,
  User,
  LogOut,
  CalendarCheck,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "../components/ModalPerfil";
import ReservationsModal from "../components/ModalReservas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReservationsModal, setShowReservationsModal] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success("Sesión cerrada correctamente");
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        {/* Top Bar */}
        <div className="bg-blue-900 text-white text-sm px-4 py-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <a
                href="tel:+123456789"
                className="flex items-center hover:text-blue-300 transition"
              >
                <Phone className="w-4 h-4 mr-1" /> +1 234 567 89
              </a>
              <a
                href="https://maps.google.com"
                className="flex items-center hover:text-blue-300 transition"
              >
                <MapPin className="w-4 h-4 mr-1" /> Av. Paraíso 123, Costa del Sol
              </a>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button className="hover:text-blue-300 transition">Idioma</button>
              <button className="hover:text-blue-300 transition">Moneda</button>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center hover:text-blue-300 transition"
                  >
                    <User className="w-4 h-4 mr-1" />
                    {user?.username || "Mi cuenta"}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" /> Mi perfil
                      </button>
                      <button
                        onClick={() => {
                          setShowReservationsModal(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 flex items-center"
                      >
                        <CalendarCheck className="w-4 h-4 mr-2" /> Mis reservas
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center hover:text-blue-300 transition"
                >
                  <User className="w-4 h-4 mr-1" /> Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>

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
              {["Inicio", "Habitaciones", "Servicios", "Galería", "Contacto"].map(
                (item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="text-gray-700 hover:text-blue-600 font-medium transition relative group"
                  >
                    {item}
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )
              )}
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
            {["Inicio", "Habitaciones", "Servicios", "Galería", "Contacto"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block text-gray-700 font-medium border-b pb-2 border-gray-100 hover:text-blue-600 transition"
                >
                  {item}
                </Link>
              )
            )}
            <Link
              to="/reserva"
              className="block bg-blue-600 text-white text-center py-3 rounded-full hover:bg-blue-700 transition"
            >
              Reservar Ahora
            </Link>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 font-medium hover:text-blue-600 transition"
                >
                  <Settings className="w-4 h-4 mr-2 inline" /> Mi perfil
                </button>
                <button
                  onClick={() => {
                    setShowReservationsModal(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 font-medium hover:text-blue-600 transition"
                >
                  <CalendarCheck className="w-4 h-4 mr-2 inline" /> Mis reservas
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 font-medium hover:text-blue-600 transition"
                >
                  <LogOut className="w-4 h-4 mr-2 inline" /> Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block flex items-center text-gray-700 font-medium hover:text-blue-600 transition"
              >
                <User className="w-4 h-4 mr-1" />
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Modales */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
      {showReservationsModal && (
        <ReservationsModal
          userId={user?.id_usuario}
          isOpen={showReservationsModal}
          onClose={() => setShowReservationsModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
