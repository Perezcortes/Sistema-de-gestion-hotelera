import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import hero from '../assets/hero.avif';
import ReservaPage from './ReservaPage'; // importar el componente del formulario

const Home = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 font-sans">
      {/* Hero */}
      <section className="relative pt-16">
        <img
          src={hero}
          alt="Hotel"
          className="w-full h-[90vh] object-cover brightness-75"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">Bienvenido a Hotel Paraíso</h1>
          <p className="mt-4 text-lg md:text-2xl drop-shadow">Donde el lujo y la comodidad se encuentran</p>
          <button
            onClick={() => navigate('/reserva')} // 👈 Redirige a la ruta
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold shadow"
          >
            Reservar ahora
          </button>
        </div>
      </section>

      {/* Mostrar el formulario si el usuario hizo clic */}
      {mostrarFormulario && (
        <div className="px-6 py-10">
          <ReservaPage />
        </div>
      )}

      {/* Sección de servicios */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: 'Habitaciones de Lujo',
              text: 'Con vista al mar, aire acondicionado y wifi.',
            },
            {
              title: 'Restaurante Gourmet',
              text: 'Disfruta de platillos internacionales con chefs de clase mundial.',
            },
            {
              title: 'Spa & Wellness',
              text: 'Relájate con masajes, sauna y tratamientos de belleza.',
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
