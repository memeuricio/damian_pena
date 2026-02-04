import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function ServiceDetail({ service, isOpen, onClose }) {
  if (!service) return null;

  const getServiceIcon = (category) => {
    const icons = {
      design: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      consultation: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      documentation: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      renovation: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    };
    return icons[category] || icons.design;
  };

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
            {getServiceIcon(service.category)}
          </div>
          
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            {service.title}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
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
          <h2 className="text-xl font-semibold text-primary-900 mb-4">
            Descripción del Servicio
          </h2>
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
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start">
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
              {service.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start">
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
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2 text-accent-600 font-bold">
                1
              </div>
              <h4 className="font-medium text-primary-900 mb-1">Consulta Inicial</h4>
              <p className="text-sm text-primary-600">Análisis de necesidades y objetivos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2 text-accent-600 font-bold">
                2
              </div>
              <h4 className="font-medium text-primary-900 mb-1">Propuesta</h4>
              <p className="text-sm text-primary-600">Desarrollo de propuesta técnica</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2 text-accent-600 font-bold">
                3
              </div>
              <h4 className="font-medium text-primary-900 mb-1">Desarrollo</h4>
              <p className="text-sm text-primary-600">Ejecución del proyecto</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2 text-accent-600 font-bold">
                4
              </div>
              <h4 className="font-medium text-primary-900 mb-1">Entrega</h4>
              <p className="text-sm text-primary-600">Revisión y entrega final</p>
            </div>
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
                <div key={index} className="aspect-[4/3] bg-surface-100 rounded-lg overflow-hidden">
                  <img
                    src={example}
                    alt={`Ejemplo ${index + 1} de ${service.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-surface-200 flex items-center justify-center" style={{ display: 'none' }}>
                    <svg className="w-12 h-12 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
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
            <Link to={ROUTES.CONTACT}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Solicitar Cotización
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Más Información
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}