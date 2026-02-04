import { useState } from 'react';
import Header from '../components/layout/Header';
import ProjectGrid from '../components/sections/ProjectGrid';
import ProjectDetail from '../components/sections/ProjectDetail';
import { mockProjects } from '../data/mockData';

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleProjectClick = (projectId) => {
    const project = mockProjects.find(p => p.id === projectId);
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedProject(null);
  };

  const handleNavigateProject = (direction) => {
    if (!selectedProject) return;
    
    const currentIndex = mockProjects.findIndex(p => p.id === selectedProject.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === mockProjects.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? mockProjects.length - 1 : currentIndex - 1;
    }
    
    setSelectedProject(mockProjects[newIndex]);
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
        project={selectedProject}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onNavigate={handleNavigateProject}
      />
    </div>
  );
}