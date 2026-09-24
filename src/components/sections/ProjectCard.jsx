import { Link, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import OptimizedImage from '../common/OptimizedImage';
import ImagePlaceholder from '../common/ImagePlaceholder';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function ProjectCard({ project, onClick }) {
  const navigate = useNavigate();
  const primaryImage = project.images.find(img => img.isPrimary) || project.images[0];

  // Si no hay handler de modal, el proyecto se abre como página propia.
  const handleClick = () => {
    if (onClick) onClick(project.id);
    else navigate(`${ROUTES.PORTFOLIO}/${project.id}`);
  };

  return (
    <Card hover padding="none" className="overflow-hidden group">
      {/* div con role=button en vez de <button>: el contenido de la tarjeta
          incluye títulos y párrafos, que no son contenido válido dentro de un
          <button> según el HTML. */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className="w-full text-left cursor-pointer"
        aria-label={`Ver detalle de ${project.title}`}
      >
        {/* Image */}
        <div className="aspect-[4/3] bg-surface-100 overflow-hidden rounded-t-lg">
          <OptimizedImage
            src={primaryImage?.url}
            alt={primaryImage?.alt || project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallback={<ImagePlaceholder />}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
              {getCategoryLabel(project.category)}
            </span>
            <span className="text-sm text-primary-500 font-medium">
              {project.specifications.year}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-primary-900 mb-2 group-hover:text-sky-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-primary-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center justify-between text-sm text-primary-500">
            {/* El área es opcional: solo se muestra si el dato existe. */}
            {project.specifications.area ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {project.specifications.area}
              </span>
            ) : null}
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.specifications.location}
            </span>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-surface-100 text-primary-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
