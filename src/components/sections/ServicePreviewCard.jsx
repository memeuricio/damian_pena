import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function ServicePreviewCard({ service }) {
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
      <Link to={`${ROUTES.SERVICES}#${service.id}`} className="block">
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto transition-colors ${getIconColor(service.category)}`}>
            {getServiceIcon(service.category)}
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
            {service.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center justify-center">
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