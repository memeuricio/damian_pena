import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function ProjectCard({ project, onClick }) {
  const primaryImage = project.images.find(img => img.isPrimary) || project.images[0];

  const handleClick = () => {
    if (onClick) {
      onClick(project.id);
    }
  };

  const CardContent = () => (
    <>
      {/* Image */}
      <div className="aspect-[4/3] bg-surface-100 overflow-hidden rounded-t-lg">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {/* Placeholder when image fails to load */}
        <div className="w-full h-full bg-surface-200 flex items-center justify-center" style={{ display: primaryImage ? 'none' : 'flex' }}>
          <svg className="w-16 h-16 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
            {getCategoryLabel(project.category)}
          </span>
          <span className="text-sm text-primary-500 font-medium">
            {project.specifications.year}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-primary-900 mb-2 group-hover:text-accent-600 transition-colors">
          {project.title}
        </h3>

        <p className="text-primary-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between text-sm text-primary-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {project.specifications.area}
          </span>
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
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-surface-100 text-primary-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <Card hover padding="none" className="overflow-hidden group">
      {onClick ? (
        <button onClick={handleClick} className="w-full text-left">
          <CardContent />
        </button>
      ) : (
        <Link to={`${ROUTES.PORTFOLIO}/${project.id}`} className="block">
          <CardContent />
        </Link>
      )}
    </Card>
  );
}