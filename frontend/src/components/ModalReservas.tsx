import React from "react";

interface ModalReservasProps {
  userId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ReservationsModal: React.FC<ModalReservasProps> = ({ userId, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      {/* contenido del modal */}
      <h2>Reservas del usuario ID: {userId}</h2>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default ReservationsModal;
