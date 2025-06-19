import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../api";

interface ModalPerfilProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalPerfil: React.FC<ModalPerfilProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const errorToastId = useRef<string | number | null>(null);
  const successToastId = useRef<string | number | null>(null);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const showErrorToast = (message: string) => {
    if (errorToastId.current === null || !toast.isActive(errorToastId.current)) {
      errorToastId.current = toast.error(message, {
        autoClose: 2000,
        onClose: () => {
          errorToastId.current = null;
        },
      });
    }
  };

  const showSuccessToast = (message: string) => {
    if (successToastId.current === null || !toast.isActive(successToastId.current)) {
      successToastId.current = toast.success(message, {
        autoClose: 1000,
        onClose: () => {
          successToastId.current = null;
        },
      });
    }
  };

  const dismissToasts = () => {
    if (successToastId.current !== null) {
      toast.dismiss(successToastId.current);
      successToastId.current = null;
    }
    if (errorToastId.current !== null) {
      toast.dismiss(errorToastId.current);
      errorToastId.current = null;
    }
  };

  const handleSave = async () => {
    if (loading) return;

    if (!nombre.trim()) {
      showErrorToast("El nombre no puede estar vacío");
      return;
    }

    if (!username.trim()) {
      showErrorToast("El nombre de usuario no puede estar vacío");
      return;
    }

    if (!isValidEmail(email)) {
      showErrorToast("Por favor ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);

    try {
      await api.put("/usuarios", {
        nombre: nombre.trim(),
        username: username.trim(),
        email: email.trim(),
      });

      showSuccessToast("Perfil actualizado con éxito");

      setTimeout(() => {
        onClose();
        dismissToasts();
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      const backendMessage = error.response?.data?.message || "";

      if (backendMessage.includes("correo") || backendMessage.includes("email") || backendMessage.includes("usuario")) {
        showErrorToast("Ya existe una cuenta con ese correo o nombre de usuario. Por favor usa otros.");
      } else {
        showErrorToast(backendMessage || error.message || "Error al actualizar perfil");
      }
    } finally {
      setLoading(false);
    }

  };

  const handleClose = () => {
    dismissToasts();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Editar Perfil</Dialog.Title>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                className="w-full border rounded p-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                className="w-full border rounded p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="w-full border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalPerfil;
