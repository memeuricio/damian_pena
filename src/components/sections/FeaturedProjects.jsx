import { Link } from 'react-router-dom';
import ProjectPreviewCard from './ProjectPreviewCard';
import Button from '../common/Button';
import { ROUTES } from '../../utils/constants';
import { mockProjects } from '../../data/mockData';

export default function FeaturedProjects() {
  const featuredProjects = mockProjects.filter(project => project.featured).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Proyectos Destacados
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Explora algunos de mis trabajos más representativos en diferentes categorías 
            de proyectos arquitectónicos.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <ProjectPreviewCard key={project.id} project={project} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to={ROUTES.PORTFOLIO}>
            <Button variant="primary" size="lg">
              Ver Portafolio Completo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}