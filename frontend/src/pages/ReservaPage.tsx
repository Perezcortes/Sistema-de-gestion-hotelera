import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';

// --- TIPOS ---
type TipoHabitacion = 'individual' | 'doble' | 'suite';
type MetodoPago = 'tarjeta' | 'paypal' | 'transferencia';
type Destino = 'México' | 'Monterrey' | 'Guadalajara' | 'Chiapas';

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  destino: Destino | '';
  fechaLlegada: string;
  horaLlegada: string;
  fechaSalida: string;
  horaSalida: string; // Nuevo campo
  numeroPersonas: number;
  tipoHabitacion: TipoHabitacion | '';
  serviciosExtra: string[];
  metodoPago: MetodoPago | '';
  comentarios: string;
};

// --- CONSTANTES ---
const PRECIOS_HABITACION: Record<TipoHabitacion, number> = {
  individual: 500,
  doble: 800,
  suite: 1200,
};

const DESTINOS: { value: Destino, label: string }[] = [
  { value: 'México', label: 'Centro Histórico' },
  { value: 'Monterrey', label: 'Cerro de la Silla' },
  { value: 'Guadalajara', label: 'Lago de Chapala' },
  { value: 'Chiapas', label: 'San Cristóbal' },
];

const SERVICIOS_EXTRA = [
  'Desayuno buffet',
  'Spa',
  'Transporte al aeropuerto',
  'Gimnasio'
];

const METODOS_PAGO: MetodoPago[] = ['tarjeta', 'paypal', 'transferencia'];

// --- COMPONENTE PRINCIPAL ---
const ReservaPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [form, setForm] = useState<FormData>({
    nombre: user?.username || '',
    email: user?.email || '',
    telefono: '',
    destino: '',
    fechaLlegada: '',
    horaLlegada: '',
    fechaSalida: '',
    horaSalida: '', // Nuevo campo
    numeroPersonas: 1,
    tipoHabitacion: '',
    serviciosExtra: [],
    metodoPago: '',
    comentarios: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Debes iniciar sesión para hacer una reserva', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/login', { state: { from: '/reserva' } });
    } else {
      const hasReservedBefore = localStorage.getItem('hasReservedBefore');
      if (!hasReservedBefore) {
        setShowWelcomeModal(true);
        localStorage.setItem('hasReservedBefore', 'true');
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate]);

  // --- FUNCIONES DE AYUDA ---
  const calcularNoches = (): number => {
    if (!form.fechaLlegada || !form.fechaSalida) return 0;

    const fechaInicio = new Date(form.fechaLlegada);
    const fechaFin = new Date(form.fechaSalida);

    if (fechaFin <= fechaInicio) return 0;

    const diferenciaMs = fechaFin.getTime() - fechaInicio.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  };

  const calcularPrecioTotal = (): number => {
    const noches = calcularNoches();
    return noches > 0 && form.tipoHabitacion
      ? PRECIOS_HABITACION[form.tipoHabitacion] * noches * form.numeroPersonas
      : 0;
  };

  const validarFormulario = (): boolean => {
    const { nombre, email, telefono, destino, fechaLlegada, fechaSalida, tipoHabitacion, metodoPago } = form;
    return !!(
      nombre && email && telefono && destino &&
      fechaLlegada && fechaSalida &&
      new Date(fechaSalida) > new Date(fechaLlegada) &&
      tipoHabitacion && metodoPago
    );
  };

  const limpiarFormulario = () => {
    setForm(prev => ({
      ...prev,
      telefono: '',
      destino: '',
      fechaLlegada: '',
      horaLlegada: '',
      fechaSalida: '',
      horaSalida: '',
      numeroPersonas: 1,
      tipoHabitacion: '',
      serviciosExtra: [],
      metodoPago: '',
      comentarios: '',
    }));
  };

  // --- MANEJADORES DE EVENTOS ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (type === 'checkbox' && name === 'serviciosExtra') {
      setForm(prev => ({
        ...prev,
        serviciosExtra: checked
          ? [...prev.serviciosExtra, value]
          : prev.serviciosExtra.filter(serv => serv !== value),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 128);
    doc.text('Confirmación de Reserva', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    let yPosition = 40;
    const datosReserva = [
      { label: 'Nombre', value: form.nombre },
      { label: 'Email', value: form.email },
      { label: 'Teléfono', value: form.telefono },
      { label: 'Destino', value: DESTINOS.find(d => d.value === form.destino)?.label || '' },
      { label: 'Fecha de llegada', value: `${form.fechaLlegada} ${form.horaLlegada}` },
      { label: 'Fecha de salida', value: `${form.fechaSalida} ${form.horaSalida}\n(Nota: Se respetará la hora de salida indicada sin recargos)` }, // Actualizado
      { label: 'Número de personas', value: form.numeroPersonas.toString() },
      { label: 'Tipo de habitación', value: form.tipoHabitacion },
      {
        label: 'Servicios extra',
        value: form.serviciosExtra.length > 0
          ? `${form.serviciosExtra.join(', ')} (se cobrarán durante la estadía)`
          : 'Ninguno'
      },
      { label: 'Método de pago', value: form.metodoPago },
      { label: 'Comentarios', value: form.comentarios || 'Ninguno' },
      { label: 'Noches', value: calcularNoches().toString() },
    ];

    datosReserva.forEach((item) => {
      doc.text(`${item.label}:`, 20, yPosition);
      doc.text(item.value, 70, yPosition);
      yPosition += 10;
    });

    yPosition += 5;
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0);
    doc.text(
      `Precio total estimado: $${calcularPrecioTotal().toLocaleString()}`,
      105,
      yPosition,
      { align: 'center' }
    );

    doc.save(`reserva-${form.nombre}-${form.destino}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error('Por favor complete todos los campos requeridos correctamente', {
        position: "top-right",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Error al enviar la reserva');

      toast.success('¡Reserva enviada con éxito!', {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => setShowModal(true), 1000);
    } catch (error) {
      console.error(error);
      toast.error('Hubo un problema al enviar la reserva. Intente nuevamente.', {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg my-6 sm:my-10 font-sans relative">
      <ToastContainer />

      {/* Modal de Bienvenida */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
              ¡Bienvenido, {user?.username}!
            </h2>
            <p className="text-center mb-6">
              Ahora puedes realizar tu reserva en nuestro hotel.
              Disfruta de nuestros servicios exclusivos y de la mejor atención.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Comenzar reserva
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">Reserva tu experiencia</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección 1: Datos personales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block font-medium mb-1 text-sm sm:text-base">Nombre completo *</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1 text-sm sm:text-base">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>

        <div>
          <label htmlFor="telefono" className="block font-medium mb-1 text-sm sm:text-base">Teléfono *</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Sección 2: Selección de destino */}
        <div>
          <label className="block font-medium mb-2 text-sm sm:text-base">Selecciona tu destino *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {DESTINOS.map((destino) => (
              <label
                key={destino.value}
                className={`border rounded-lg p-2 sm:p-3 cursor-pointer transition-all text-xs sm:text-sm ${form.destino === destino.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`}
              >
                <input
                  type="radio"
                  name="destino"
                  value={destino.value}
                  checked={form.destino === destino.value}
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <div className="flex flex-col items-center">
                  <span className="font-medium sm:text-base">{destino.value}</span>
                  <span className="text-xs">{destino.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Sección 3: Fechas de estadía - Formato solicitado */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaLlegada" className="block font-medium mb-1 text-sm sm:text-base">Fecha de llegada *</label>
              <input
                id="fechaLlegada"
                name="fechaLlegada"
                type="date"
                value={form.fechaLlegada}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="horaLlegada" className="block font-medium mb-1 text-sm sm:text-base">Hora aproximada *</label>
              <input
                id="horaLlegada"
                name="horaLlegada"
                type="time"
                value={form.horaLlegada}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaSalida" className="block font-medium mb-1 text-sm sm:text-base">Fecha de salida *</label>
              <input
                id="fechaSalida"
                name="fechaSalida"
                type="date"
                value={form.fechaSalida}
                onChange={handleChange}
                required
                min={form.fechaLlegada || new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="horaSalida" className="block font-medium mb-1 text-sm sm:text-base">Hora de salida *</label>
              <input
                id="horaSalida"
                name="horaSalida"
                type="time"
                value={form.horaSalida}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1 italic">
                * Por favor respete la hora de salida indicada para evitar recargos adicionales.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 4: Personas y habitación - Formato solicitado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="numeroPersonas" className="block font-medium mb-1 text-sm sm:text-base">Número de personas *</label>
            <input
              id="numeroPersonas"
              name="numeroPersonas"
              type="number"
              min="1"
              max="10"
              value={form.numeroPersonas}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="tipoHabitacion" className="block font-medium mb-1 text-sm sm:text-base">Tipo de habitación *</label>
            <select
              id="tipoHabitacion"
              name="tipoHabitacion"
              value={form.tipoHabitacion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="">Seleccione una opción</option>
              <option value="individual">Individual ($500/noche)</option>
              <option value="doble">Doble ($800/noche)</option>
              <option value="suite">Suite ($1200/noche)</option>
            </select>
          </div>
        </div>

        {/* Sección 5: Servicios extra */}
        <fieldset className="border border-gray-300 p-3 sm:p-4 rounded-lg">
          <legend className="font-medium px-2 text-sm sm:text-base">Servicios extra (opcionales)</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2">
            {SERVICIOS_EXTRA.map((servicio) => (
              <label key={servicio} className="flex items-center gap-2 text-sm sm:text-base">
                <input
                  type="checkbox"
                  name="serviciosExtra"
                  value={servicio}
                  checked={form.serviciosExtra.includes(servicio)}
                  onChange={handleChange}
                  className="h-4 w-4 sm:h-5 sm:w-5 accent-blue-500"
                />
                <span>{servicio}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">
            * Los servicios adicionales seleccionados se cobrarán durante su estadía en el hotel.
          </p>
        </fieldset>

        {/* Sección 6: Método de pago */}
        <div>
          <label htmlFor="metodoPago" className="block font-medium mb-1 text-sm sm:text-base">Método de pago *</label>
          <select
            id="metodoPago"
            name="metodoPago"
            value={form.metodoPago}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="">Seleccione un método</option>
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="paypal">PayPal</option>
            <option value="transferencia">Transferencia bancaria</option>
          </select>
        </div>

        {/* Sección 7: Comentarios */}
        <div>
          <label htmlFor="comentarios" className="block font-medium mb-1 text-sm sm:text-base">Comentarios o peticiones especiales</label>
          <textarea
            id="comentarios"
            name="comentarios"
            value={form.comentarios}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            placeholder="Ej: Necesito una habitación con vista al mar, alergias alimentarias, etc."
          />
        </div>

        {/* Sección 8: Resumen y precio */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg shadow-inner border border-blue-100">
          <h2 className="text-lg font-semibold mb-2 sm:mb-3 text-blue-800">Resumen de tu reserva</h2>

          <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-3 text-sm sm:text-base">
            <div>
              <p className="font-medium">Destino:</p>
              <p>{DESTINOS.find(d => d.value === form.destino)?.label || '-'}</p>
            </div>
            <div>
              <p className="font-medium">Noches:</p>
              <p>{form.fechaLlegada && form.fechaSalida ? calcularNoches() : '-'}</p>
            </div>
            <div>
              <p className="font-medium">Check-in:</p>
              <p>{form.fechaLlegada} {form.horaLlegada}</p>
            </div>
            <div>
              <p className="font-medium">Check-out:</p>
              <p>{form.fechaSalida} {form.horaSalida && `a las ${form.horaSalida}`}
                <br />
                <span className="text-xs text-gray-500">(Sin recargos si se respeta la hora indicada)</span>
              </p>
            </div>
            <div>
              <p className="font-medium">Huéspedes:</p>
              <p>{form.numeroPersonas}</p>
            </div>
            <div>
              <p className="font-medium">Habitación:</p>
              <p>{form.tipoHabitacion || '-'}</p>
            </div>
          </div>

          <div className="border-t border-blue-200 pt-2 sm:pt-3">
            <p className="font-bold text-base sm:text-lg text-blue-900">
              Total estimado: ${calcularPrecioTotal().toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 italic mt-1">
              * Precio estimado. Los cargos finales pueden variar.
            </p>
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          disabled={!validarFormulario() || isLoading}
        >
          {isLoading ? 'Procesando...' : 'Confirmar reserva'}
        </button>
      </form>

      {/* Modal de confirmación */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-blue-700">
              ¡Reserva confirmada!
            </h2>

            <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 border-b pb-1">Detalles de la reserva</h3>

              <div className="grid grid-cols-2 gap-y-1 sm:gap-y-2">
                <p className="font-medium">Nombre:</p>
                <p>{form.nombre}</p>

                <p className="font-medium">Email:</p>
                <p>{form.email}</p>

                <p className="font-medium">Teléfono:</p>
                <p>{form.telefono}</p>

                <p className="font-medium">Destino:</p>
                <p>{DESTINOS.find(d => d.value === form.destino)?.label}</p>

                <p className="font-medium">Check-in:</p>
                <p>{form.fechaLlegada} {form.horaLlegada && `a las ${form.horaLlegada}`}</p>

                <p className="font-medium">Check-out:</p>
                <p>{form.fechaSalida} {form.horaSalida && `a las ${form.horaSalida}`}</p>

                <p className="font-medium">Noches:</p>
                <p>{calcularNoches()}</p>

                <p className="font-medium">Huéspedes:</p>
                <p>{form.numeroPersonas}</p>

                <p className="font-medium">Habitación:</p>
                <p className="capitalize">{form.tipoHabitacion}</p>

                <p className="font-medium">Servicios:</p>
                <p>
                  {form.serviciosExtra.length > 0
                    ? `${form.serviciosExtra.join(', ')} (se cobrarán durante la estadía)`
                    : 'Ninguno'}
                </p>

                <p className="font-medium">Pago:</p>
                <p className="capitalize">
                  {form.metodoPago === 'tarjeta' ? 'Tarjeta de crédito/débito' :
                    form.metodoPago === 'paypal' ? 'PayPal' : 'Transferencia bancaria'}
                </p>
              </div>

              {form.comentarios && (
                <>
                  <p className="font-medium mt-1 sm:mt-2">Notas especiales:</p>
                  <p className="bg-gray-50 p-2 rounded text-xs sm:text-sm">{form.comentarios}</p>
                </>
              )}

              <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-green-50 rounded border border-green-100">
                <p className="font-bold text-green-800 text-center text-sm sm:text-base">
                  Total estimado: ${calcularPrecioTotal().toLocaleString()}
                </p>
                <p className="text-xs text-green-600 text-center mt-1">
                  Se ha enviado un correo de confirmación a {form.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
              <button
                onClick={generarPDF}
                className="flex-1 bg-green-600 text-white py-2 px-3 sm:px-4 rounded hover:bg-green-700 transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Descargar comprobante
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  limpiarFormulario();
                }}
                className="flex-1 bg-gray-100 text-gray-800 py-2 px-3 sm:px-4 rounded hover:bg-gray-200 transition text-xs sm:text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaPage;