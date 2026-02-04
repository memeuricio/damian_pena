import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: ROUTES.HOME, label: 'Inicio' },
    { path: ROUTES.PORTFOLIO, label: 'Portafolio' },
    { path: ROUTES.SERVICES, label: 'Servicios' },
    { path: ROUTES.ABOUT, label: 'Acerca de' },
    { path: ROUTES.CONTACT, label: 'Contacto' }
  ];

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">Damián Peña</h3>
            <p className="text-gray-300 mb-4">
              Dibujante Arquitectónico Titulado especializado en proyectos residenciales y comerciales.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📧 damian.pena@email.com</p>
              <p>📱 +56 9 1234 5678</p>
              <p>📍 Santiago, Chile</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Planos Arquitectónicos</li>
              <li>Consultoría Técnica</li>
              <li>Documentación de Obra</li>
              <li>Remodelaciones</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Damián Peña. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {/* Social Media Links - Placeholder */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zm4.624 7.512l-2.077 9.442c-.155.705-.568.874-.915.874-.297 0-.623-.155-.934-.463L9.537 13.5l-2.15 2.151c-.238.238-.438.438-.9.438-.297 0-.623-.155-.934-.463l-1.934-1.934c-.238-.238-.438-.438-.438-.9 0-.297.155-.623.463-.934l2.151-2.15-3.865-3.178c-.308-.311-.463-.637-.463-.934 0-.347.169-.76.874-.915l9.442-2.077c.347-.077.694-.077 1.041 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}