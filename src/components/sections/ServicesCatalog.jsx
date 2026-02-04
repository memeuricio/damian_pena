import { useState } from 'react';
import ServiceCard from './ServiceCard';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import { getCategoryLabel } from '../../utils/helpers';
import { mockServices } from '../../data/mockData';

export default function ServicesCatalog({ onServiceSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Todos los Servicios' },
    ...Object.values(SERVICE_CATEGORIES).map(category => ({
      key: category,
      label: getCategoryLabel(category)
    }))
  ];

  const filteredServices = selectedCategory === 'all' 
    ? mockServices 
    : mockServices.filter(service => service.category === selectedCategory);

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((category) => {
          const isActive = selectedCategory === category.key;
          const count = category.key === 'all' 
            ? mockServices.length
            : mockServices.filter(s => s.category === category.key).length;

          return (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'bg-surface-100 text-primary-700 hover:bg-surface-200 hover:text-primary-900'
              }`}
            >
              {category.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                isActive
                  ? 'bg-accent-500 text-white'
                  : 'bg-surface-200 text-primary-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service}
            onViewDetails={onServiceSelect}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-surface-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <h3 className="text-lg font-medium text-primary-900 mb-2">
            No hay servicios disponibles
          </h3>
          <p className="text-primary-600">
            No se encontraron servicios en esta categoría.
          </p>
        </div>
      )}
    </div>
  );
}