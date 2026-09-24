import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import ErrorBoundary from '../common/ErrorBoundary';
import PlanSvg from '../three/PlanSvg';
import { PLAN } from '../three/housePlan';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ROUTES } from '../../utils/constants';

// El visor 3D va en su propio chunk: three.js no entra en la carga inicial.
const BuildingScene = lazy(() => import('../three/BuildingScene'));

const PROCESS_STEPS = [
  {
    title: 'Levantamiento',
    description: 'Tomo las medidas del terreno o del inmueble existente, y su estado actual.',
  },
  {
    title: 'Plano técnico',
    description: 'Dibujo la distribución, cortes, elevaciones y detalles constructivos.',
  },
  {
    title: 'Modelo 3D',
    description: 'Construyo el modelo y coordino las especialidades: estructural, eléctrica y sanitaria.',
  },
  {
    title: 'Documentación',
    description: 'Armo la carpeta completa con todo lo que exige la municipalidad para el permiso.',
  },
];

/** Comprueba si el navegador puede dibujar WebGL, sin dejar el contexto abierto. */
function detectWebGL() {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

function StaticPlan() {
  return (
    <div className="h-full w-full p-4 sm:p-8">
      <PlanSvg />
    </div>
  );
}

export default function PlanToBuilding() {
  const reducedMotion = useReducedMotion();
  const [webglSupported] = useState(detectWebGL);

  // Si el navegador no trae IntersectionObserver, se carga de inmediato.
  const [shouldLoad, setShouldLoad] = useState(() => typeof IntersectionObserver === 'undefined');
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === 'undefined');
  const [sceneReady, setSceneReady] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const containerRef = useRef(null);

  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  // El 3D solo se monta cuando la sección entra en pantalla, y deja de renderizar
  // cuando sale. Sin margen extra a propósito: el chunk del visor pesa más que
  // todo el resto del sitio junto, así que no debe descargarse en la carga inicial.
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

  const showScene = webglSupported && shouldLoad;

  return (
    <section id="plano-a-obra" className="py-16 sm:py-24 bg-gradient-to-br from-sky-50 via-surface-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-700 mb-4">
            Modelado 3D
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 mb-4">
            Del plano a la obra
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Así es como tu idea se convierte en un proyecto construible: parto del
            levantamiento, dibujo el plano técnico y lo modelo en 3D para revisar
            cada detalle antes de llegar a la obra.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Visor */}
          <div className="lg:col-span-3">
            <div
              ref={containerRef}
              className="relative h-[380px] sm:h-[460px] lg:h-[540px] rounded-2xl border border-surface-200 bg-gradient-to-b from-surface-100 to-sky-50 shadow-sm overflow-hidden"
            >
              {showScene ? (
                <ErrorBoundary fallback={<StaticPlan />}>
                  <Suspense fallback={<StaticPlan />}>
                    <BuildingScene
                      active={isVisible}
                      reducedMotion={reducedMotion}
                      replayToken={replayToken}
                      onReady={handleSceneReady}
                    />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <StaticPlan />
              )}

              {/* Pista de interacción: solo si el visor llegó a montarse */}
              {sceneReady && (
                <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-primary-600 shadow-sm border border-surface-200">
                  <svg className="h-4 w-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Arrastra para girar
                </div>
              )}

              {/* Repetir animación */}
              {sceneReady && !reducedMotion && (
                <button
                  type="button"
                  onClick={() => setReplayToken((token) => token + 1)}
                  className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-primary-600 shadow-sm border border-surface-200 transition-colors hover:text-accent-600 hover:border-accent-200"
                >
                  Repetir animación
                </button>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-primary-500">
              Vivienda de ejemplo de {PLAN.width} × {PLAN.depth} m ·{' '}
              {PLAN.width * PLAN.depth} m² construidos · muros a altura de corte
            </p>
          </div>

          {/* Proceso */}
          <div className="lg:col-span-2">
            <ol className="space-y-6">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary-900">{step.title}</h3>
                    <p className="text-sm text-primary-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <Link to={ROUTES.CONTACT}>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Cotizar mi proyecto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
