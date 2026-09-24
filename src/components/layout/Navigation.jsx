import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { professionalProfile } from '../../data/mockData';

const navigationItems = [
  { path: ROUTES.HOME, label: 'Inicio' },
  { path: ROUTES.PORTFOLIO, label: 'Portafolio' },
  { path: ROUTES.SERVICES, label: 'Servicios' },
  { path: ROUTES.ABOUT, label: 'Acerca de' },
  { path: ROUTES.CONTACT, label: 'Contacto' }
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { fullName, title } = professionalProfile.personalInfo;

  const isActive = (path) => location.pathname === path;
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  return (
    <nav className="bg-white border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <span className="text-xl font-bold text-primary-900">
              {fullName}
            </span>
            <span className="ml-2 text-sm text-primary-600 hidden sm:block">
              {title}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-primary-600 hover:bg-surface-100 hover:text-primary-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="menu-movil"
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-600 hover:text-primary-900 hover:bg-surface-100"
            >
              <span className="sr-only">{isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="menu-movil">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-surface-50 border-t border-surface-200">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-primary-600 hover:bg-surface-100 hover:text-primary-900'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
