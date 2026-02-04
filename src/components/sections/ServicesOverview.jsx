import { Link } from 'react-router-dom';
import ServicePreviewCard from './ServicePreviewCard';
import Button from '../common/Button';
import { ROUTES } from '../../utils/constants';
import { mockServices } from '../../data/mockData';

export default function ServicesOverview() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-emerald-50 via-surface-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Mis Servicios
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Ofrezco servicios especializados en dibujo arquitectónico, desde planos técnicos 
            hasta consultoría completa para tus proyectos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockServices.map((service) => (
            <ServicePreviewCard key={service.id} service={service} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to={ROUTES.SERVICES}>
            <Button variant="primary" size="lg">
              Ver Todos los Servicios
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-surface-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">
                ¿Necesitas un proyecto personalizado?
              </h3>
              <p className="text-primary-600 mb-6">
                Cada proyecto es único. Trabajo de cerca contigo para entender tus necesidades 
                específicas y crear soluciones arquitectónicas que superen tus expectativas.
              </p>
              <Link to={ROUTES.CONTACT}>
                <Button variant="outline">
                  Solicitar Cotización
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-sky-50 rounded-lg">
                <div className="text-3xl font-bold text-sky-600 mb-2">24h</div>
                <div className="text-sm text-primary-600">Respuesta promedio</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                <div className="text-sm text-primary-600">Proyectos entregados</div>
              </div>
              <div className="text-center p-4 bg-accent-50 rounded-lg">
                <div className="text-3xl font-bold text-accent-600 mb-2">3+</div>
                <div className="text-sm text-primary-600">Años experiencia</div>
              </div>
              <div className="text-center p-4 bg-surface-100 rounded-lg">
                <div className="text-3xl font-bold text-primary-700 mb-2">50+</div>
                <div className="text-sm text-primary-600">Clientes satisfechos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}