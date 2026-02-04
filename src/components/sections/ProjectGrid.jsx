import { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import ProjectFilters from './ProjectFilters';
import SearchBar from './SearchBar';
import { mockProjects } from '../../data/mockData';

export default function ProjectGrid({ onProjectClick }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('year'); // year, title, category
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = mockProjects;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.shortDescription.toLowerCase().includes(searchLower) ||
        project.specifications.location.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return b.specifications.year - a.specifications.year;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, sortBy, searchTerm]);

  // Calculate project counts by category (for all projects, not filtered by search)
  const projectCounts = useMemo(() => {
    const counts = {};
    mockProjects.forEach(project => {
      counts[project.category] = (counts[project.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('year');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm.trim() !== '';

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Buscar por nombre, descripción, ubicación o características..."
        />
      </div>

      {/* Filters */}
      <ProjectFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        projectCounts={projectCounts}
      />

      {/* Results Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <p className="text-primary-600">
            {filteredAndSortedProjects.length} proyecto{filteredAndSortedProjects.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProjects.length !== 1 ? 's' : ''}
          </p>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-accent-600 hover:text-accent-700 underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-primary-600">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-surface-300 rounded-md px-3 py-1 bg-white text-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          >
            <option value="year">Año (más reciente)</option>
            <option value="title">Nombre (A-Z)</option>
            <option value="category">Categoría</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2">
          {searchTerm.trim() && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-100 text-accent-800">
              Búsqueda: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-accent-600 hover:text-accent-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-100 text-accent-800">
              Categoría: {selectedCategory}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-2 text-accent-600 hover:text-accent-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={onProjectClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-surface-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-primary-900 mb-2">
            No se encontraron proyectos
          </h3>
          <p className="text-primary-600 mb-4">
            {searchTerm.trim() 
              ? `No hay proyectos que coincidan con "${searchTerm}"`
              : 'No hay proyectos en la categoría seleccionada.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-accent-600 hover:text-accent-700 underline"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}