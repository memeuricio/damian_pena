import Card from '../common/Card';
import Button from '../common/Button';
import { getCategoryLabel } from '../../utils/helpers';

export default function ServiceCard({ service, onViewDetails }) {
  const getServiceIcon = (category) => {
    const icons = {
      design: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      consultation: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      documentation: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      renovation: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    };
    return icons[category] || icons.design;
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600">
            {getServiceIcon(service.category)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary-900">
              {service.title}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-primary-700">
              {getCategoryLabel(service.category)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-primary-600 mb-6 flex-grow">
        {service.description}
      </p>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-primary-900 mb-3">Incluye:</h4>
        <ul className="space-y-2">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-4 h-4 text-accent-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-primary-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Deliverables */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-primary-900 mb-3">Entregables:</h4>
        <ul className="space-y-1">
          {service.deliverables.slice(0, 3).map((deliverable, index) => (
            <li key={index} className="text-sm text-primary-600 flex items-center">
              <svg className="w-3 h-3 text-primary-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {deliverable}
            </li>
          ))}
          {service.deliverables.length > 3 && (
            <li className="text-sm text-primary-500 italic">
              +{service.deliverables.length - 3} más...
            </li>
          )}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-surface-200 pt-4 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-primary-600">Tiempo estimado:</div>
            <div className="font-semibold text-primary-900">{service.estimatedTimeframe}</div>
          </div>
          {service.priceRange && (
            <div className="text-right">
              <div className="text-sm text-primary-600">Desde:</div>
              <div className="font-semibold text-accent-600">{service.priceRange}</div>
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails && onViewDetails(service)}
        >
          Ver Detalles
        </Button>
      </div>
    </Card>
  );
}