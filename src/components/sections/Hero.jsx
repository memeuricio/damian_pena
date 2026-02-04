import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { ROUTES } from '../../utils/constants';

export default function Hero() {
  return (
    <section className="relative bg-linear-to-br from-surface-50 to-surface-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-900 mb-6 leading-tight">
              Damián Peña
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-primary-600 mt-2">
                Dibujante Arquitectónico Titulado
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Especialista en proyectos residenciales y comerciales. Transformo ideas en 
              planos técnicos precisos y visualizaciones arquitectónicas profesionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={ROUTES.PORTFOLIO}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Ver Portafolio
                </Button>
              </Link>
              <Link to={ROUTES.CONTACT}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contactar
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-surface-200">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary-900">50+</div>
                <div className="text-sm text-primary-600">Proyectos</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary-900">3+</div>
                <div className="text-sm text-primary-600">Años Experiencia</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary-900">100%</div>
                <div className="text-sm text-primary-600">Satisfacción</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-square bg-linear-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center">
              {/* Placeholder for professional photo */}
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-primary-600 text-sm">
                  Foto profesional
                  <br />
                  (por agregar)
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-500 rounded-lg opacity-20 rotate-12"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-500 rounded-lg opacity-20 -rotate-12"></div>
          </div>
        </div>
      </div>
    </section>
  );
}