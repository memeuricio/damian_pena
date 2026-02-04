import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getCategoryLabel } from '../../utils/helpers';

export default function ProjectDetail({ project, isOpen, onClose, onNavigate }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  if (!project) return null;

  const currentImage = project.images[selectedImageIndex];

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = () => {
    setIsImageZoomed(!isImageZoomed);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-surface-200 pb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-primary-900 mb-2">
                {project.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-primary-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                  {getCategoryLabel(project.category)}
                </span>
                <span>{project.specifications.year}</span>
                <span>{project.specifications.location}</span>
              </div>
            </div>
            
            {/* Navigation buttons */}
            {onNavigate && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('prev')}
                >
                  ← Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('next')}
                >
                  Siguiente →
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative">
            <div 
              className={`relative bg-surface-100 rounded-lg overflow-hidden cursor-zoom-in ${
                isImageZoomed ? 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center' : 'aspect-16/10'
              }`}
              onClick={handleImageClick}
            >
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt={currentImage.alt}
                  className={`${
                    isImageZoomed 
                      ? 'max-w-full max-h-full object-contain cursor-zoom-out' 
                      : 'w-full h-full object-cover'
                  }`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Placeholder */}
              <div className="w-full h-full bg-surface-200 flex items-center justify-center" style={{ display: currentImage ? 'none' : 'flex' }}>
                <svg className="w-16 h-16 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Navigation arrows */}
              {!isImageZoomed && project.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Zoom indicator */}
              {!isImageZoomed && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  Click para ampliar
                </div>
              )}
            </div>

            {/* Image caption */}
            {currentImage?.caption && (
              <p className="text-sm text-primary-600 mt-2 text-center">
                {currentImage.caption}
              </p>
            )}
          </div>

          {/* Thumbnail navigation */}
          {project.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {project.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? 'border-accent-500'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-surface-200 flex items-center justify-center" style={{ display: 'none' }}>
                    <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-3">
              Descripción del Proyecto
            </h3>
            <p className="text-primary-700 leading-relaxed mb-4">
              {project.description}
            </p>
            
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-primary-900 mb-2">Características:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-surface-100 text-primary-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-3">
              Especificaciones Técnicas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-surface-200">
                <span className="text-primary-600">Área:</span>
                <span className="font-medium text-primary-900">{project.specifications.area}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-200">
                <span className="text-primary-600">Ubicación:</span>
                <span className="font-medium text-primary-900">{project.specifications.location}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-200">
                <span className="text-primary-600">Año:</span>
                <span className="font-medium text-primary-900">{project.specifications.year}</span>
              </div>
              {project.specifications.client && (
                <div className="flex justify-between items-center py-2 border-b border-surface-200">
                  <span className="text-primary-600">Cliente:</span>
                  <span className="font-medium text-primary-900">{project.specifications.client}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-primary-600">Categoría:</span>
                <span className="font-medium text-primary-900">{getCategoryLabel(project.category)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close zoom overlay */}
      {isImageZoomed && (
        <button
          onClick={() => setIsImageZoomed(false)}
          className="fixed top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Modal>
  );
}