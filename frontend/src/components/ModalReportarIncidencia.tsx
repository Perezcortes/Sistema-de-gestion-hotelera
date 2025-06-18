import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";

interface ModalReportarIncidenciaProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number; // aunque no se use
}

const ModalReportarIncidencia: React.FC<ModalReportarIncidenciaProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!descripcion.trim()) {
      toast.error("La descripción no puede estar vacía");
      return;
    }

    setLoading(true);

    // Simulamos un retraso para parecer real
    setTimeout(() => {
      toast.success("Incidencia reportada correctamente");
      setDescripcion("");
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Reportar Incidencia</Dialog.Title>

          <textarea
            className="w-full border rounded p-2 h-32 resize-none"
            placeholder="Describe la incidencia que deseas reportar..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={loading}
            autoFocus
          />

          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ModalReportarIncidencia;
