import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Información del hotel */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Hotel Paraíso</h2>
          <p className="text-sm">
            Disfruta de una experiencia única en hospedaje con nosotros. Confort, lujo y excelente atención al cliente.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Enlaces</h3>
          <ul className="space-y-1">
            <li>
              <button className="hover:text-white transition text-left">Inicio</button>
            </li>
            <li>
              <button className="hover:text-white transition text-left">Habitaciones</button>
            </li>
            <li>
              <button className="hover:text-white transition text-left">Reservaciones</button>
            </li>
            <li>
              <button className="hover:text-white transition text-left">Contacto</button>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              +1 234 567 89
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              contacto@hotelparaiso.com
            </li>
            <li className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Av. Paraíso 123, Costa del Sol
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Síguenos</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => window.open("https://facebook.com", "_blank")}
              className="hover:text-white transition"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open("https://instagram.com", "_blank")}
              className="hover:text-white transition"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open("https://twitter.com", "_blank")}
              className="hover:text-white transition"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer base */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Hotel Paraíso. Todos los derechos reservados.
      </div>
    </footer>
  );
}
