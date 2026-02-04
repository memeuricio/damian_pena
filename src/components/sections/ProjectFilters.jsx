import { PROJECT_CATEGORIES } from '../../utils/constants';
import { getCategoryLabel } from '../../utils/helpers';

export default function ProjectFilters({ 
  selectedCategory, 
  onCategoryChange, 
  projectCounts = {} 
}) {
  const categories = [
    { key: 'all', label: 'Todos' },
    ...Object.values(PROJECT_CATEGORIES).map(category => ({
      key: category,
      label: getCategoryLabel(category)
    }))
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => {
        const isActive = selectedCategory === category.key;
        const count = category.key === 'all' 
          ? Object.values(projectCounts).reduce((sum, count) => sum + count, 0)
          : projectCounts[category.key] || 0;

        return (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-accent-600 text-white shadow-md'
                : 'bg-surface-100 text-primary-700 hover:bg-surface-200 hover:text-primary-900'
            }`}
          >
            {category.label}
            {count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                isActive
                  ? 'bg-accent-500 text-white'
                  : 'bg-surface-200 text-primary-600'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}