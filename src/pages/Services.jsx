import { useState } from 'react';
import Header from '../components/layout/Header';
import ServicesCatalog from '../components/sections/ServicesCatalog';
import ServiceDetail from '../components/sections/ServiceDetail';

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedService(null);
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
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}