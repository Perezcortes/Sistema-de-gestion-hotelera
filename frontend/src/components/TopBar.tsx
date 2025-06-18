// src/components/TopBar.tsx
import React, { useState } from "react";
import {
  Phone,
  MapPin,
  User,
  LogOut,
  CalendarCheck,
  Settings,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ModalPerfil";
import ReservationsModal from "./ModalReservas";
import ModalIncidencia from "./ModalReportarIncidencia";
import { toast } from "react-toastify";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [showIncidenciaModal, setShowIncidenciaModal] = useState(false);

  const handleLogout = () => {
    toast.success("Sesión cerrada correctamente", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setUserMenuOpen(false);
    setTimeout(() => {
      logout();
      navigate("/");
    }, 1800);
  };

  return (
    <>
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
              target="_blank"
              rel="noreferrer"
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
                      onClick={() => {
                        setShowIncidenciaModal(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" /> Reportar incidencia
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
      {showIncidenciaModal && (
        <ModalIncidencia
          isOpen={showIncidenciaModal}
          onClose={() => setShowIncidenciaModal(false)}
        />
      )}
    </>
  );
};

export default TopBar;
