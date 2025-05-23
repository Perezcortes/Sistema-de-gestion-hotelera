import React, { useState } from 'react';

type FormData = {
  nombre: string;
  email: string;
  telefono: string;
  fechaLlegada: string;
  horaLlegada: string;
  fechaSalida: string;
  numeroPersonas: string;
  tipoHabitacion: string;
  serviciosExtra: string[];
  metodoPago: string;
  comentarios: string;
};

const ReservaPage: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    fechaLlegada: '',
    horaLlegada: '',
    fechaSalida: '',
    numeroPersonas: '1',
    tipoHabitacion: '',
    serviciosExtra: [],
    metodoPago: '',
    comentarios: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (type === 'checkbox' && name === 'serviciosExtra') {
      setForm((prev) => ({
        ...prev,
        serviciosExtra: checked
          ? [...prev.serviciosExtra, value]
          : prev.serviciosExtra.filter((serv) => serv !== value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Reserva enviada:', form);
    alert('¡Reserva enviada con éxito!');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">Formulario de Reserva</h1>
      <form onSubmit={handleSubmit}>

        <label htmlFor="nombre" className="block font-semibold mb-1">Nombre:</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="email" className="block font-semibold mb-1">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="telefono" className="block font-semibold mb-1">Teléfono:</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={form.telefono}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="fechaLlegada" className="block font-semibold mb-1">Fecha de llegada:</label>
        <input
          id="fechaLlegada"
          name="fechaLlegada"
          type="date"
          value={form.fechaLlegada}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="horaLlegada" className="block font-semibold mb-1">Hora de llegada:</label>
        <input
          id="horaLlegada"
          name="horaLlegada"
          type="time"
          value={form.horaLlegada}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="fechaSalida" className="block font-semibold mb-1">Fecha de salida:</label>
        <input
          id="fechaSalida"
          name="fechaSalida"
          type="date"
          value={form.fechaSalida}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="numeroPersonas" className="block font-semibold mb-1">Número de personas:</label>
        <input
          id="numeroPersonas"
          name="numeroPersonas"
          type="number"
          min="1"
          value={form.numeroPersonas}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label htmlFor="tipoHabitacion" className="block font-semibold mb-1">Tipo de habitación:</label>
        <select
          id="tipoHabitacion"
          name="tipoHabitacion"
          value={form.tipoHabitacion}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione</option>
          <option value="individual">Individual</option>
          <option value="doble">Doble</option>
          <option value="suite">Suite</option>
        </select>

        <fieldset className="mb-4">
          <legend className="font-semibold mb-2">Servicios extra:</legend>
          <div className="flex flex-wrap gap-4">
            {['Desayuno', 'Transporte', 'Spa', 'Gimnasio', 'Piscina', 'Estacionamiento'].map((serv) => (
              <label key={serv} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="serviciosExtra"
                  value={serv}
                  checked={form.serviciosExtra.includes(serv)}
                  onChange={handleChange}
                  className="form-checkbox text-blue-600"
                />
                <span>{serv}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="metodoPago" className="block font-semibold mb-1">Método de pago:</label>
        <select
          id="metodoPago"
          name="metodoPago"
          value={form.metodoPago}
          onChange={handleChange}
          required
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione</option>
          <option value="tarjeta">Tarjeta de crédito</option>
          <option value="paypal">PayPal</option>
          <option value="transferencia">Transferencia bancaria</option>
        </select>

        <label htmlFor="comentarios" className="block font-semibold mb-1">Comentarios:</label>
        <textarea
          id="comentarios"
          name="comentarios"
          value={form.comentarios}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Enviar reserva
        </button>
      </form>
    </div>
  );
};

export default ReservaPage;
