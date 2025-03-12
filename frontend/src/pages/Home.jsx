import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <header className="header">
        <h1>Hotel</h1>
        <nav className="nav">
          <ul>
            <li><Link to="/habitaciones">Habitaciones</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/nosotros">Acerca de</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </nav>
      </header>

      <section
        className="hero"
        style={{
          background: 'url(/images/fondo.jpg) no-repeat center center/cover',
          textAlign: 'center',
          padding: '60px 20px',
        }}
      >
        <h2>Bienvenido</h2>
        <p>¿Qué podemos hacer por ti?.</p>
        <Link to="/reservar" className="btn">Reservar Ahora</Link>
      </section>

      <section className="rooms">
        <h2>Habitaciones</h2>
        <div className="room-list">
          <div className="room">
            <h3>Habitación Deluxe</h3>
            <p>Lujo y comodidad garantizados.</p>
          </div>
          <div className="room">
            <h3>Suite Familiar</h3>
            <p>Ideal para toda la familia.</p>
          </div>
          <div className="room">
            <h3>Habitación Estándar</h3>
            <p>Comodidad a un precio accesible.</p>
          </div>
        </div>
      </section>

      <section className="services">
        <h2>Servicios</h2>
        <ul>
          <li>Wi-Fi gratuito</li>
          <li>Desayuno incluido</li>
          <li>Gimnasio</li>
          <li>Servicio a la habitación</li>
        </ul>
      </section>

      <section className="about">
        <h2>Acerca de Nosotros</h2>
        <p>Información sobre nuestro hotel y misión.</p>
      </section>

      <footer className="footer">
        <h2>Contacto</h2>
        <p>Email: info@hoteltodoenuno.com</p>
        <p>Teléfono: +123 456 7890</p>
      </footer>
    </div>
  );
};

export default Home;
