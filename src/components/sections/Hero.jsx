import { Link } from 'react-router-dom';
import { memo } from 'react';
import Button from '../common/Button';
import OptimizedImage from '../common/OptimizedImage';
import { ROUTES } from '../../utils/constants';

/**
 * Portada.
 *
 * Va directamente sobre el espacio modelo, sin fondo propio: las líneas del
 * canvas son el fondo. Se quitó la imagen decorativa que había antes (16 MB en
 * origen, 126 KB ya optimizada) porque competía con las líneas y no aportaba.
 */
const Hero = memo(function Hero() {
  return (
    <>
      {/* Main Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Damián Peña
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-cyan-300 mt-2">
                  Dibujante Arquitectónico
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Especialista en proyectos residenciales y comerciales. Transformo ideas en
                planos técnicos precisos y visualizaciones arquitectónicas profesionales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={ROUTES.PORTFOLIO}>
                  <Button variant="light" size="lg" className="w-full sm:w-auto">
                    Ver Portafolio
                  </Button>
                </Link>
                <Link to={ROUTES.CONTACT}>
                  <Button variant="outlineLight" size="lg" className="w-full sm:w-auto">
                    Contactar
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">50+</div>
                  <div className="text-sm text-slate-400">Proyectos</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">3+</div>
                  <div className="text-sm text-slate-400">Años Experiencia</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-slate-400">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Image/Visual - Only on desktop */}
            <div className="relative max-w-md mx-auto hidden lg:block">
              <div className="aspect-square bg-gradient-to-br from-sky-100 via-accent-100 to-emerald-100 rounded-full overflow-hidden shadow-2xl ring-1 ring-white/20">
                <OptimizedImage
                  src="/damian.jpg"
                  alt="Damián Peña - Dibujante Arquitectónico Titulado"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-cyan-400 rounded-lg opacity-20 rotate-12" />
              <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-emerald-400 rounded-lg opacity-20 -rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Profile Image */}
      <div className="lg:hidden flex justify-center pb-8">
        <div className="relative w-40 h-40">
          <div className="aspect-square bg-gradient-to-br from-sky-100 via-accent-100 to-emerald-100 rounded-full overflow-hidden shadow-2xl ring-1 ring-white/20">
            <OptimizedImage
              src="/damian.jpg"
              alt="Damián Peña - Dibujante Arquitectónico Titulado"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Floating elements for mobile */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400 rounded-lg opacity-20 rotate-12" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-400 rounded-lg opacity-20 -rotate-12" />
        </div>
      </div>
    </>
  );
});

export default Hero;
