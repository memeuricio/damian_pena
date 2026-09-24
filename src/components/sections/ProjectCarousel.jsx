import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import OptimizedImage from '../common/OptimizedImage';
import ImagePlaceholder from '../common/ImagePlaceholder';
import ErrorBoundary from '../common/ErrorBoundary';
import { createCardCanvas } from '../three/projectIcons';
import { DRAG_PIXELS_PER_STEP, DRAG_THRESHOLD, carouselStep } from '../three/carouselLayout';
import { getCategoryLabel } from '../../utils/helpers';
import { detectWebGL } from '../../utils/webgl';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ROUTES } from '../../utils/constants';

// La escena 3D va en su propio chunk, igual que la maqueta.
const ProjectCarouselScene = lazy(() => import('../three/ProjectCarouselScene'));

/* --------------------------------------------------------------- respaldo */

/**
 * Selector sin WebGL: las mismas tarjetas, generadas como imagen desde el mismo
 * lienzo que usa la escena 3D.
 */
function FallbackSelector({ projects, selectedIndex, onSelect }) {
  const images = useMemo(
    () => projects.map((project) => createCardCanvas(project).toDataURL()),
    [projects]
  );

  return (
    <div className="flex gap-4 overflow-x-auto justify-center px-4 py-6">
      {projects.map((project, index) => (
        <button
          key={project.id}
          type="button"
          onClick={() => onSelect(index)}
          aria-current={index === selectedIndex}
          className={`shrink-0 w-28 rounded-xl transition-opacity ${
            index === selectedIndex ? 'opacity-100' : 'opacity-50 hover:opacity-80'
          }`}
        >
          <img src={images[index]} alt="" className="w-full rounded-xl shadow-sm" />
          <span className="mt-2 block text-xs font-medium text-primary-700">{project.title}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- detalle */

function ProjectSpotlight({ project }) {
  const primaryImage = project.images.find((image) => image.isPrimary) || project.images[0];

  return (
    <div
      // La key remonta el bloque al cambiar de proyecto, así se ve la transición.
      key={project.id}
      className="animate-fade-in mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-center rounded-2xl border border-surface-200 bg-white p-5 sm:p-8 shadow-sm"
    >
      {/* Imagen */}
      <div className="lg:col-span-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-100">
          <OptimizedImage
            src={primaryImage?.url}
            alt={primaryImage?.alt || project.title}
            className="w-full h-full object-cover"
            fallback={<ImagePlaceholder />}
          />
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
            {getCategoryLabel(project.category)}
          </span>
        </div>
      </div>

      {/* Información */}
      <div className="lg:col-span-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-2">
          {project.title}
        </h3>

        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-primary-600">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {project.specifications.year}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {project.specifications.location}
          </span>
          {project.specifications.area && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {project.specifications.area}
            </span>
          )}
        </div>

        <p className="text-primary-700 leading-relaxed mb-5">
          {project.description}
        </p>

        {project.tags?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-surface-100 px-3 py-1 text-sm text-primary-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link to={`${ROUTES.PORTFOLIO}/${project.id}`}>
          <Button variant="outline">
            Ver ficha completa
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- sección */

export default function ProjectCarousel({ projects }) {
  const reducedMotion = useReducedMotion();
  const [webglSupported] = useState(detectWebGL);
  const [shouldLoad, setShouldLoad] = useState(() => typeof IntersectionObserver === 'undefined');
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === 'undefined');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const containerRef = useRef(null);

  // El arrastre se lleva en refs: cambia en cada pointermove y no debe provocar
  // un render de React por fotograma.
  const dragRef = useRef(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const pointerIdRef = useRef(null);

  const count = projects.length;
  const step = carouselStep(count, false);

  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  const selectBy = useCallback(
    (delta) => {
      setSelectedIndex((current) => {
        if (count === 0) return 0;
        return ((current + delta) % count + count) % count;
      });
    },
    [count]
  );

  const selectTo = useCallback((index) => setSelectedIndex(index), []);

  /* --- solo se monta la escena cuando la sección entra en pantalla --- */
  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: '0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /* --- arrastre horizontal --- */
  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    // Si el puntero cae sobre un botón (las flechas, los puntos) no se inicia
    // arrastre: capturar el puntero aquí le robaría el clic a ese botón.
    if (event.target.closest?.('button, a, input, select, textarea, [data-no-drag]')) return;

    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    draggingRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (pointerIdRef.current !== event.pointerId) return;

    const dx = event.clientX - startXRef.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) draggingRef.current = true;
    if (!draggingRef.current) return;

    // El giro acompaña al dedo exactamente los mismos radianes que un paso.
    dragRef.current = (dx / DRAG_PIXELS_PER_STEP) * step;
  };

  const handlePointerUp = (event) => {
    if (pointerIdRef.current !== event.pointerId) return;

    const dx = event.clientX - startXRef.current;
    const steps = Math.round(dx / DRAG_PIXELS_PER_STEP);

    pointerIdRef.current = null;
    dragRef.current = 0;

    // Arrastrar hacia la derecha trae la tarjeta anterior.
    if (Math.abs(steps) >= 1) selectBy(-steps);

    // Se libera después del clic sintético, para que un arrastre no seleccione.
    window.setTimeout(() => {
      draggingRef.current = false;
    }, 0);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectBy(1);
    }
  };

  const selectedProject = projects[selectedIndex];

  if (!selectedProject) return null;

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-surface-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-700 mb-4">
            Carrusel 3D
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Explora los proyectos
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Arrastra o usa las flechas para recorrer los proyectos. Abajo verás el
            detalle del que tengas seleccionado.
          </p>
        </div>

        {/* Selector */}
        <div className="relative">
          <div
            ref={containerRef}
            role="group"
            aria-label="Selector de proyectos"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative h-[280px] sm:h-[340px] lg:h-[400px] rounded-2xl border border-surface-200 bg-white shadow-sm overflow-hidden cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            {webglSupported && shouldLoad ? (
              <ErrorBoundary fallback={<FallbackSelector projects={projects} selectedIndex={selectedIndex} onSelect={selectTo} />}>
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center text-sm text-primary-400">
                      Cargando selector…
                    </div>
                  }
                >
                  <ProjectCarouselScene
                    projects={projects}
                    selectedIndex={selectedIndex}
                    onSelect={selectTo}
                    active={isVisible}
                    reducedMotion={reducedMotion}
                    dragRef={dragRef}
                    draggingRef={draggingRef}
                    onReady={handleSceneReady}
                  />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <FallbackSelector projects={projects} selectedIndex={selectedIndex} onSelect={selectTo} />
            )}

            {/* Flechas, al estilo del selector de Isaac */}
            <button
              type="button"
              onClick={() => selectBy(-1)}
              aria-label="Proyecto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 bg-white/90 text-primary-600 shadow-sm transition-colors hover:text-accent-600 hover:border-accent-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => selectBy(1)}
              aria-label="Proyecto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 bg-white/90 text-primary-600 shadow-sm transition-colors hover:text-accent-600 hover:border-accent-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Anuncio para lectores de pantalla */}
            <p className="sr-only" aria-live="polite">
              Proyecto seleccionado: {selectedProject.title}
            </p>
          </div>

          {/* Puntos */}
          <div className="mt-5 flex justify-center gap-2">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => selectTo(index)}
                aria-label={`Ver ${project.title}`}
                aria-current={index === selectedIndex}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === selectedIndex
                    ? 'w-8 bg-accent-600'
                    : 'w-2 bg-surface-300 hover:bg-surface-400'
                }`}
              />
            ))}
          </div>

          {!reducedMotion && sceneReady && (
            <p className="mt-3 text-center text-xs text-primary-400">
              {projects.length} proyectos · arrastra para girar
            </p>
          )}
        </div>

        {/* Detalle del proyecto seleccionado */}
        <ProjectSpotlight project={selectedProject} />
      </div>
    </section>
  );
}
