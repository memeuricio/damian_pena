import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import ServicesCatalog from '../components/sections/ServicesCatalog';
import ServiceDetail from '../components/sections/ServiceDetail';
import { mockServices } from '../data/mockData';
import { ROUTES } from '../utils/constants';

/**
 * Abre el detalle del servicio indicado en el hash (/services#2).
 * Es lo que hace funcionar los enlaces "Ver servicios" de la home y del footer.
 */
export default function Services() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedService = useMemo(() => {
    const id = location.hash.replace('#', '');
    if (!id) return null;
    return mockServices.find((service) => service.id === id) ?? null;
  }, [location.hash]);

  const handleServiceSelect = (service) => {
    navigate(`${ROUTES.SERVICES}#${service.id}`);
  };

  const handleCloseDetail = () => {
    navigate(ROUTES.SERVICES, { replace: true });
  };

  return (
    <div>
      <Header 
        title="Servicios"
        subtitle="Conoce todos los servicios profesionales que ofrezco para tus proyectos arquitectónicos"
        className="bg-surface-50"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ServicesCatalog onServiceSelect={handleServiceSelect} />
      </div>

      <ServiceDetail
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
