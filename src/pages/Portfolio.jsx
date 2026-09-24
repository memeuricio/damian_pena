import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import ProjectGrid from '../components/sections/ProjectGrid';
import ProjectDetail from '../components/sections/ProjectDetail';
import { mockProjects } from '../data/mockData';
import { ROUTES } from '../utils/constants';

/**
 * El proyecto abierto vive en la URL (/portfolio/:projectId), no en estado local.
 * Así los enlaces a un proyecto concreto desde la home funcionan de verdad y se
 * puede compartir el enlace directo.
 */
export default function Portfolio() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const selectedProject = useMemo(
    () => mockProjects.find((project) => project.id === projectId) ?? null,
    [projectId]
  );

  const handleProjectClick = (id) => {
    navigate(`${ROUTES.PORTFOLIO}/${id}`);
  };

  const handleCloseDetail = () => {
    navigate(ROUTES.PORTFOLIO);
  };

  const handleNavigateProject = (direction) => {
    if (!selectedProject) return;

    const currentIndex = mockProjects.findIndex((p) => p.id === selectedProject.id);
    const lastIndex = mockProjects.length - 1;
    const newIndex =
      direction === 'next'
        ? currentIndex === lastIndex ? 0 : currentIndex + 1
        : currentIndex === 0 ? lastIndex : currentIndex - 1;

    navigate(`${ROUTES.PORTFOLIO}/${mockProjects[newIndex].id}`);
  };

  return (
    <div>
      <Header 
        title="Portafolio"
        subtitle="Explora mis proyectos arquitectónicos más destacados"
        className="bg-surface-50"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProjectGrid onProjectClick={handleProjectClick} />
      </div>

      <ProjectDetail
        key={selectedProject?.id ?? 'cerrado'}
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={handleCloseDetail}
        onNavigate={handleNavigateProject}
      />
    </div>
  );
}
