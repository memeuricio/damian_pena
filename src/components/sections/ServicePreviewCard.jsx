import { Link } from 'react-router-dom';
import Card from '../common/Card';
import ServiceIcon from '../common/ServiceIcon';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function ServicePreviewCard({ service }) {
  const getIconColor = (category) => {
    const colors = {
      design: 'bg-sky-100 text-sky-600 group-hover:bg-sky-200',
      consultation: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200',
      documentation: 'bg-accent-100 text-accent-600 group-hover:bg-accent-200',
      renovation: 'bg-surface-100 text-primary-600 group-hover:bg-surface-200'
    };
    return colors[category] || colors.design;
  };

  return (
    <Card hover className="text-center group">
      {/* El enlace lleva a /services#<id>; Services.jsx lee el hash y abre el detalle. */}
      <Link to={`${ROUTES.SERVICES}#${service.id}`} className="block">
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto transition-colors ${getIconColor(service.category)}`}>
            <ServiceIcon category={service.category} />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-primary-900 mb-3 group-hover:text-accent-600 transition-colors">
          {service.title}
        </h3>

        <p className="text-primary-600 mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <ul className="text-sm text-primary-500 space-y-1">
            {service.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeframe and Category */}
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-primary-700">
            {getCategoryLabel(service.category)}
          </span>
          <span className="text-primary-500">
            {service.estimatedTimeframe}
          </span>
        </div>
      </Link>
    </Card>
  );
}
