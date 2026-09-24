import { Link } from 'react-router-dom';
import { memo } from 'react';
import Button from '../common/Button';
import OptimizedImage from '../common/OptimizedImage';
import { ROUTES } from '../../utils/constants';

const Hero = memo(function Hero() {
  return (
    <>
      {/* Main Hero Section with Background */}
      <section className="relative bg-gradient-to-br from-sky-50 via-surface-50 to-emerald-50 overflow-hidden">
        {/*
          Fondo decorativo al 20% de opacidad. Antes era un div con background-image
          de 16 MB y will-change:transform, lo que mantenía un layer de ~390 MB en GPU.
          Ahora es un <picture> de 126 KB sin promoción de layer.
        */}
        <OptimizedImage
          src="/bg2.jpg"
          alt=""
          loading="eager"
          fetchPriority="low"
          className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
        />

        {/* Bottom Gradient Overlay */}
        <div 
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(240, 249, 255, 1), transparent)'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-900 mb-6 leading-tight">
                Damián Peña
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-primary-600 mt-2">
                  Dibujante Arquitectónico
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-primary-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Especialista en proyectos residenciales y comerciales. Transformo ideas en 
                planos técnicos precisos y visualizaciones arquitectónicas profesionales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={ROUTES.PORTFOLIO}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
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

            {/* Image/Visual - Only on desktop */}
            <div className="relative max-w-md mx-auto hidden lg:block">
              <div className="aspect-square bg-gradient-to-br from-sky-100 via-accent-100 to-emerald-100 rounded-full overflow-hidden shadow-lg">
                <OptimizedImage
                  src="/damian.jpg"
                  alt="Damián Peña - Dibujante Arquitectónico Titulado"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-sky-400 rounded-lg opacity-20 rotate-12" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-emerald-400 rounded-lg opacity-20 -rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Profile Image - Outside main section, no background */}
      <div className="lg:hidden flex justify-center py-8 bg-gradient-to-br from-sky-50 via-surface-50 to-emerald-50">
        <div className="relative w-40 h-40">
          <div className="aspect-square bg-gradient-to-br from-sky-100 via-accent-100 to-emerald-100 rounded-full overflow-hidden shadow-lg">
            <OptimizedImage
              src="/damian.jpg"
              alt="Damián Peña - Dibujante Arquitectónico Titulado"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Floating elements for mobile */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-sky-400 rounded-lg opacity-20 rotate-12" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-400 rounded-lg opacity-20 -rotate-12" />
        </div>
      </div>
    </>
  );
});

export default Hero;
