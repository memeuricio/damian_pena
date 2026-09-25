import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import OptimizedImage from '../common/OptimizedImage';
import ImagePlaceholder from '../common/ImagePlaceholder';
import { getCategoryLabel } from '../../utils/helpers';

/**
 * Detalle de un proyecto en un modal.
 *
 * Importante: renderízalo con `key={project?.id}` (ver pages/Portfolio.jsx). Así
 * React lo remonta al cambiar de proyecto o al cerrarlo, y el índice de imagen y
 * el zoom vuelven a cero. Antes ese reset se hacía con un useEffect que provocaba
 * renders en cascada.
 */
export default function ProjectDetail({ project, isOpen, onClose, onNavigate }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  if (!project) return null;

  const images = project.images ?? [];
  const currentImage = images[selectedImageIndex];

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
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
              <h2 className="text-2xl font-bold text-primary-900 mb-2">
                {project.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-800">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {getCategoryLabel(project.category)}
                </span>
                <span>{project.specifications.year}</span>
                <span>{project.specifications.location}</span>
              </div>
            </div>

            {/* Navigation buttons */}
            {onNavigate && (
              <div className="flex space-x-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => onNavigate('prev')}>
                  ← Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => onNavigate('next')}>
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
              className={`relative bg-surface-100 rounded-lg overflow-hidden ${
                isImageZoomed
                  ? 'fixed inset-0 z-[60] bg-black/90 flex items-center justify-center'
                  : 'aspect-16/10 cursor-zoom-in'
              }`}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <OptimizedImage
                src={currentImage?.url}
                alt={currentImage?.alt || project.title}
                className={
                  isImageZoomed
                    ? 'max-w-full max-h-full object-contain cursor-zoom-out'
                    : 'w-full h-full object-cover'
                }
                fallback={<ImagePlaceholder />}
              />

              {/* Navigation arrows */}
              {!isImageZoomed && images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Imagen anterior"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Imagen siguiente"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Zoom indicator */}
              {!isImageZoomed && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Click para ampliar
                </div>
              )}
            </div>

            {/* Image caption */}
            {!isImageZoomed && currentImage?.caption && (
              <p className="text-sm text-primary-800 mt-2 text-center">
                {currentImage.caption}
              </p>
            )}
          </div>

          {/* Thumbnail navigation */}
          {images.length > 1 && !isImageZoomed && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-current={index === selectedImageIndex}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImageIndex
                      ? 'border-sky-500'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <OptimizedImage
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    fallback={<ImagePlaceholder iconClassName="w-6 h-6" />}
                  />
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
            <p className="text-primary-900 leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-primary-900 mb-2">Características:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-surface-100 text-primary-900"
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
              {/* Solo se listan los campos que existen: antes mostraba filas vacías. */}
              {project.specifications.area && (
                <div className="flex justify-between items-center py-2 border-b border-surface-200">
                  <span className="text-primary-800">Área:</span>
                  <span className="font-medium text-primary-900">{project.specifications.area}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-surface-200">
                <span className="text-primary-800">Ubicación:</span>
                <span className="font-medium text-primary-900">{project.specifications.location}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-200">
                <span className="text-primary-800">Año:</span>
                <span className="font-medium text-primary-900">{project.specifications.year}</span>
              </div>
              {project.specifications.client && (
                <div className="flex justify-between items-center py-2 border-b border-surface-200">
                  <span className="text-primary-800">Cliente:</span>
                  <span className="font-medium text-primary-900">{project.specifications.client}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-primary-800">Categoría:</span>
                <span className="font-medium text-primary-900">{getCategoryLabel(project.category)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close zoom overlay */}
      {isImageZoomed && (
        <button
          type="button"
          aria-label="Cerrar imagen ampliada"
          onClick={() => setIsImageZoomed(false)}
          className="fixed top-4 right-4 z-[61] bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Modal>
  );
}
