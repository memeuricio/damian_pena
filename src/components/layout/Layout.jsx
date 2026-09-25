import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import SiteBackground from './SiteBackground';

/**
 * Al cambiar de página vuelve arriba. Sin esto, entrar al portafolio desde el
 * final de la home te dejaba a mitad de la página nueva.
 * Si la URL trae un ancla (#), se respeta y no se fuerza el scroll.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Espacio modelo: va detrás de todo, con z-index negativo */}
      <SiteBackground />
      <ScrollToTop />
      <Navigation />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
