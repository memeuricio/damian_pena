import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function ProjectPreviewCard({ project }) {
  const primaryImage = project.images.find(img => img.isPrimary) || project.images[0];

  return (
    <Card hover padding="none" className="overflow-hidden group">
      <Link to={`${ROUTES.PORTFOLIO}/${project.id}`} className="block">
        {/* Image */}
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              className="w-full h-full min-h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* Placeholder when image fails to load */}
          <div className="w-full h-full bg-slate-200 flex items-center justify-center" style={{ display: primaryImage ? 'none' : 'flex' }}>
            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getCategoryLabel(project.category)}
            </span>
            <span className="text-sm text-slate-500">
              {project.specifications.year}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {project.shortDescription}
          </p>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{project.specifications.area}</span>
            <span>{project.specifications.location}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}