import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";

// Tipos consistentes con ReservaPage.tsx
type TipoHabitacion = 'individual' | 'doble' | 'suite';
type MetodoPago = 'tarjeta' | 'paypal' | 'transferencia';
type Destino = 'México' | 'Monterrey' | 'Guadalajara' | 'Chiapas';

interface ModalReservasProps {
  userId?: number;
  isOpen: boolean;
  onClose: () => void;
}

interface Reserva {
  id_reserva: number;
  destino: Destino;
  fecha_llegada: string;
  fecha_salida: string;
  numero_personas: number;
  tipo_habitacion: TipoHabitacion;
  servicios_extra: string[];
  comentarios: string;
  metodo_pago: MetodoPago;
  nombre: string;
  email: string;
  telefono: string;
  horaLlegada: string;
  horaSalida: string; // Nuevo campo
}

// Constantes consistentes con ReservaPage.tsx
const PRECIOS_HABITACION: Record<TipoHabitacion, number> = {
  individual: 500,
  doble: 800,
  suite: 1200,
};

const DESTINOS: { value: Destino; label: string }[] = [
  { value: "México", label: "Centro Histórico" },
  { value: "Monterrey", label: "Cerro de la Silla" },
  { value: "Guadalajara", label: "Lago de Chapala" },
  { value: "Chiapas", label: "San Cristóbal" },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calcularNoches = (fechaLlegada: string, fechaSalida: string): number => {
  const inicio = new Date(fechaLlegada);
  const fin = new Date(fechaSalida);
  if (fin <= inicio) return 0;
  const diffMs = fin.getTime() - inicio.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const calcularPrecioTotal = (
  tipoHabitacion: TipoHabitacion,
  destino: Destino,
  fechaLlegada: string,
  fechaSalida: string,
  numeroPersonas: number
): number => {
  const noches = calcularNoches(fechaLlegada, fechaSalida);
  let base = PRECIOS_HABITACION[tipoHabitacion] || 0;
  if (destino === "Chiapas") base *= 1.2;
  if (destino === "Monterrey") base *= 1.1;
  return base * noches * numeroPersonas;
};

const ModalReservas: React.FC<ModalReservasProps> = ({ isOpen, onClose }) => {
  const { authToken, user } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);

      const token = authToken || localStorage.getItem("authToken");

      fetch("http://localhost:3000/api/usuarios/historial", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar las reservas");
          return res.json();
        })
        .then((data) => {
          console.log("Datos recibidos:", data); // Para debugging
          const reservasNormalizadas = data.map((reserva: any) => ({
            id_reserva: reserva.id_reserva || reserva.id || 0,
            destino: reserva.destino || "México",
            fecha_llegada: reserva.fecha_llegada || reserva.fechaInicio || "",
            fecha_salida: reserva.fecha_salida || reserva.fechaFin || "",
            numero_personas: reserva.numero_personas || reserva.personas || 1,
            tipo_habitacion: reserva.tipo_habitacion || "individual",
            servicios_extra: Array.isArray(reserva.servicios_extra) 
              ? reserva.servicios_extra 
              : (typeof reserva.servicios_extra === 'string' 
                  ? JSON.parse(reserva.servicios_extra) 
                  : []),
            comentarios: reserva.comentarios || "",
            metodo_pago: reserva.metodo_pago || "tarjeta",
            nombre: reserva.nombre || user?.username || "",
            email: reserva.email || user?.email || "",
            telefono: reserva.telefono || "",
            horaLlegada: reserva.horaLlegada || reserva.hora_llegada || "",
            horaSalida: reserva.horaSalida || reserva.hora_salida || "" // Nuevo campo
          }));
          setReservas(reservasNormalizadas);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, authToken, user]);

  const getDestinoLabel = (destinoValue: Destino): string => {
    const destino = DESTINOS.find((d) => d.value === destinoValue);
    return destino ? `${destino.value} (${destino.label})` : destinoValue;
  };

  const getMetodoPagoLabel = (metodo: MetodoPago): string => {
    switch (metodo) {
      case "tarjeta":
        return "Tarjeta de crédito/débito";
      case "paypal":
        return "PayPal";
      case "transferencia":
        return "Transferencia bancaria";
      default:
        return "No especificado";
    }
  };

  const generarPDF = (reserva: Reserva) => {
    const precioTotal = calcularPrecioTotal(
      reserva.tipo_habitacion,
      reserva.destino,
      reserva.fecha_llegada,
      reserva.fecha_salida,
      reserva.numero_personas
    );

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 128);
    doc.text("Detalles de Reserva", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    let yPosition = 40;
    const datosReserva = [
      { label: "ID Reserva", value: reserva.id_reserva.toString() },
      { label: "Nombre", value: reserva.nombre },
      { label: "Email", value: reserva.email },
      { label: "Teléfono", value: reserva.telefono },
      { label: "Destino", value: getDestinoLabel(reserva.destino) },
      {
        label: "Check-in",
        value: `${formatDate(reserva.fecha_llegada)} ${reserva.horaLlegada ? `a las ${reserva.horaLlegada}` : ""}`,
      },
      { 
        label: "Check-out", 
        value: `${formatDate(reserva.fecha_salida)} ${reserva.horaSalida ? `a las ${reserva.horaSalida}` : ""}` +
               "\n(Nota: No habrá recargos si se respeta la hora de salida indicada)"
      },
      {
        label: "Noches",
        value: calcularNoches(reserva.fecha_llegada, reserva.fecha_salida).toString(),
      },
      { label: "Huéspedes", value: reserva.numero_personas.toString() },
      { label: "Habitación", value: reserva.tipo_habitacion },
      { 
        label: "Servicios extra", 
        value: reserva.servicios_extra.length 
          ? reserva.servicios_extra.join(", ") + " (se cobrarán durante la estadía)"
          : "Ninguno" 
      },
      {
        label: "Método de pago",
        value: getMetodoPagoLabel(reserva.metodo_pago),
      },
      { label: "Comentarios", value: reserva.comentarios || "Ninguno" },
    ];

    datosReserva.forEach((item) => {
      // Manejo de valores multilínea
      if (item.value.includes("\n")) {
        const lines = item.value.split("\n");
        doc.text(`${item.label}:`, 20, yPosition);
        lines.forEach((line, i) => {
          doc.text(line, 70, yPosition + (i * 5));
        });
        yPosition += 10 + ((lines.length - 1) * 5);
      } else {
        doc.text(`${item.label}:`, 20, yPosition);
        doc.text(item.value, 70, yPosition);
        yPosition += 10;
      }
    });

    yPosition += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0);
    doc.text(
      `Precio total estimado: $${precioTotal.toLocaleString()}`,
      105,
      yPosition,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "* Este es un comprobante estimado, los cargos finales pueden variar.",
      105,
      yPosition + 15,
      { align: "center" }
    );

    doc.save(`Reserva_${reserva.id_reserva}_${reserva.destino}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Historial de Reservas
        </h2>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {!loading && reservas.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            No tienes reservas registradas.
          </p>
        )}

        {!loading && reservas.length > 0 && (
          <div className="space-y-4">
            {reservas.map((reserva) => {
              const precioTotal = calcularPrecioTotal(
                reserva.tipo_habitacion,
                reserva.destino,
                reserva.fecha_llegada,
                reserva.fecha_salida,
                reserva.numero_personas
              );

              return (
                <div
                  key={reserva.id_reserva}
                  className="border border-blue-200 rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-blue-800">
                      Reserva #{reserva.id_reserva} - {reserva.destino}
                    </h3>
                    <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded">
                      {formatDate(reserva.fecha_llegada)} → {formatDate(reserva.fecha_salida)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="font-medium text-blue-800">Check-in:</p>
                      <p className="text-sm">
                        {formatDate(reserva.fecha_llegada)} {reserva.horaLlegada && `a las ${reserva.horaLlegada}`}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Check-out:</p>
                      <p className="text-sm">
                        {formatDate(reserva.fecha_salida)} {reserva.horaSalida && `a las ${reserva.horaSalida}`}
                        <br />
                        <span className="text-xs text-gray-500 italic">
                          (Sin recargos si se respeta la hora de salida)
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-sm">
                    <div>
                      <p className="font-medium text-blue-800">Huéspedes:</p>
                      <p>{reserva.numero_personas} persona(s)</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Habitación:</p>
                      <p className="capitalize">{reserva.tipo_habitacion}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Noches:</p>
                      <p>
                        {calcularNoches(reserva.fecha_llegada, reserva.fecha_salida)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="font-medium text-blue-800">Destino:</p>
                    <p className="text-sm">{getDestinoLabel(reserva.destino)}</p>
                  </div>

                  {reserva.servicios_extra.length > 0 && (
                    <div className="mb-2">
                      <p className="font-medium text-blue-800">Servicios:</p>
                      <p className="text-sm">
                        {reserva.servicios_extra.join(", ")} (se cobrarán durante la estadía)
                      </p>
                    </div>
                  )}

                  {reserva.comentarios && (
                    <div className="mb-2">
                      <p className="font-medium text-blue-800">Comentarios:</p>
                      <p className="text-sm italic bg-blue-100 p-2 rounded">
                        {reserva.comentarios}
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="font-medium text-blue-800">Método de pago:</p>
                    <p className="text-sm">{getMetodoPagoLabel(reserva.metodo_pago)}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-blue-200">
                    <p className="font-bold text-blue-900">
                      Total: ${precioTotal.toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generarPDF(reserva);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded shadow flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Descargar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalReservas;