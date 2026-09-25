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
                ? 'bg-cyan-400 text-slate-900 shadow-md'
                : 'bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category.label}
            {count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                isActive
                  ? 'bg-slate-900/15 text-slate-900'
                  : 'bg-white/10 text-slate-300'
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