import React, {useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import LimpiezaLogo from '../assets/Limpieza1.png';
import ActualizarHab from '../components/mantenimiento/ActualizarHab';
import Tareas from '../components/mantenimiento/Tareas';
import Solicitar from '../components/mantenimiento/solicitar';

const MantenimientoDashboardPage = () => {
  const { user } = useAuth();

  //Para los valores de la seccion en la pagina
  const [activeSection, setActiveSection] = useState('habitacion');
  
  if (!user || user.id_rol !== 5) {
    return <div>No autorizado</div>;
  }

  // Función para manejar el clic en los enlaces de navegación
  const handleNavLinkClick = (section:string, e: React.MouseEvent<HTMLAnchorElement>) => { // <--- Añade 'e: React.MouseEvent<HTMLAnchorElement>'
    e.preventDefault(); // <--- ¡Esta es la línea clave!
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'habitacion':
        return (
          <ActualizarHab/>
         
        );
      case 'tareas':
        // return <TareasContent />;
        return (
          <Tareas/>
        );
      case 'insumos':
        // return <SolicitudInsumosContent />;
        return (
          <Solicitar/>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Bienvenido al Panel de Mantenimiento</h2>
            <p>Selecciona una opción del menú para comenzar.</p>
          </div>
        );
    }
  };

  

  return (
    <div className="p-6">
    
      {/*Aqui la barra de navegación con los tres posibles acciones */}
      <nav className="bg-white border-gray-200 dark:bg-cyan-950">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={LimpiezaLogo} className="h-12" alt="LimpiezaLogo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Mantenimiento<span className='text-sm text-white/50'>.HotelParaíso </span></span>
          </a>
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-cyan-950 dark:border-gray-700">
              <li>
                <a href="#" className={`block py-2 px-3 rounded-sm md:bg-transparent md:p-0 ${
                    activeSection === 'habitacion'
                      ? 'text-sky-300'
                      : 'text-gray-100 hover:text-sky-300'
                  }`} aria-current={activeSection === 'habitacion' ? 'page' : undefined}
                  onClick={(e) => handleNavLinkClick('habitacion', e)}>Actualiza Habitación</a> {/* <--- Modificado aquí */}
              </li>
              <li>
                <a href="#"  className={`block py-2 px-3 rounded-sm md:hover:bg-transparent md:border-0 md:p-0 ${
                    activeSection === 'tareas'
                      ? 'text-sky-300'
                      : 'text-gray-100 hover:text-sky-300'
                  }`} onClick={(e) => handleNavLinkClick('tareas', e)}>Tareas</a> {/* <--- Modificado aquí */}
              </li>
              <li>
                <a href="#" className={`block py-2 px-3 rounded-sm md:hover:bg-transparent md:border-0 md:p-0 ${
                    activeSection === 'insumos'
                      ? 'text-sky-300'
                      : 'text-gray-100 hover:text-sky-300'
                  }`} onClick={(e) => handleNavLinkClick('insumos', e)}>Solicitud de insumos</a> {/* <--- Modificado aquí */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/*Seccion para que aparezca el contenido de acuerdo a lo que se presione */}
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default MantenimientoDashboardPage;