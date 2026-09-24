import { Link } from 'react-router-dom';
import Card from '../common/Card';
import OptimizedImage from '../common/OptimizedImage';
import ImagePlaceholder from '../common/ImagePlaceholder';
import { getCategoryLabel } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

export default function ProjectPreviewCard({ project }) {
  const primaryImage = project.images.find(img => img.isPrimary) || project.images[0];

  return (
    <Card hover padding="none" className="overflow-hidden group">
      <Link to={`${ROUTES.PORTFOLIO}/${project.id}`} className="block">
        {/* Image */}
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
          <OptimizedImage
            src={primaryImage?.url}
            alt={primaryImage?.alt || project.title}
            className="w-full h-full min-h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            fallback={<ImagePlaceholder />}
          />
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
            {project.specifications.area ? (
              <span>{project.specifications.area}</span>
            ) : null}
            <span>{project.specifications.location}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
