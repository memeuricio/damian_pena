import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ServiceIcon from '../common/ServiceIcon';
import OptimizedImage from '../common/OptimizedImage';
import ImagePlaceholder from '../common/ImagePlaceholder';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import { professionalProfile } from '../../data/mockData';

const PROCESS_STEPS = [
  { step: 1, title: 'Consulta Inicial', description: 'Análisis de necesidades y objetivos' },
  { step: 2, title: 'Propuesta', description: 'Desarrollo de propuesta técnica' },
  { step: 3, title: 'Desarrollo', description: 'Ejecución del proyecto' },
  { step: 4, title: 'Entrega', description: 'Revisión y entrega final' }
];

export default function ServiceDetail({ service, isOpen, onClose }) {
  if (!service) return null;

  const { email } = professionalProfile.personalInfo;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(`Consulta sobre: ${service.title}`)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center border-b border-surface-200 pb-6">
          <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent-600">
            <ServiceIcon category={service.category} className="w-12 h-12" />
          </div>
          
          <h2 className="text-3xl font-bold text-primary-900 mb-2">
            {service.title}
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800">
              {getCategoryLabel(service.category)}
            </span>
            <span className="text-primary-600">
              Tiempo estimado: {service.estimatedTimeframe}
            </span>
            {service.priceRange && (
              <span className="text-accent-600 font-semibold">
                Desde {service.priceRange}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold text-primary-900 mb-4">
            Descripción del Servicio
          </h3>
          <p className="text-primary-700 leading-relaxed text-lg">
            {service.description}
          </p>
        </div>

        {/* Features and Deliverables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              ¿Qué incluye este servicio?
            </h3>
            <ul className="space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <svg className="w-5 h-5 text-accent-500 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-primary-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Entregables
            </h3>
            <ul className="space-y-3">
              {service.deliverables.map((deliverable) => (
                <li key={deliverable} className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-primary-700">{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process Overview */}
        <div className="bg-surface-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            Proceso de Trabajo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PROCESS_STEPS.map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2 text-accent-600 font-bold">
                  {step}
                </div>
                <h4 className="font-medium text-primary-900 mb-1">{title}</h4>
                <p className="text-sm text-primary-600">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        {service.examples && service.examples.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Ejemplos de Trabajo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.examples.map((example, index) => (
                <div key={example} className="aspect-[4/3] bg-surface-100 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={example}
                    alt={`Ejemplo ${index + 1} de ${service.title}`}
                    className="w-full h-full object-cover"
                    fallback={<ImagePlaceholder iconClassName="w-12 h-12" />}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-accent-50 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-primary-900 mb-2">
            ¿Interesado en este servicio?
          </h3>
          <p className="text-primary-600 mb-4">
            Conversemos sobre tu proyecto y cómo puedo ayudarte a materializarlo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.CONTACT} onClick={onClose}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Solicitar Cotización
              </Button>
            </Link>
            {/* Antes este botón no hacía nada al pulsarlo */}
            <a href={mailtoHref}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Escribir por Email
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
