import Card from '../common/Card';
import Button from '../common/Button';
import ServiceIcon from '../common/ServiceIcon';
import { getCategoryLabel } from '../../utils/helpers';

export default function ServiceCard({ service, onViewDetails }) {
  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 shrink-0">
          <ServiceIcon category={service.category} />
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

      {/* Description */}
      <p className="text-primary-600 mb-6 grow">
        {service.description}
      </p>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-primary-900 mb-3">Incluye:</h4>
        <ul className="space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start">
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
          {service.deliverables.slice(0, 3).map((deliverable) => (
            <li key={deliverable} className="text-sm text-primary-600 flex items-center">
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
          onClick={() => onViewDetails?.(service)}
        >
          Ver Detalles
        </Button>
      </div>
    </Card>
  );
}
