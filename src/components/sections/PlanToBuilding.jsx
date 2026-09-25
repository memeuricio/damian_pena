import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import ErrorBoundary from '../common/ErrorBoundary';
import PlanSvg from '../three/PlanSvg';
import { PLAN } from '../three/housePlan';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { detectWebGL } from '../../utils/webgl';
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
  const [showPlan, setShowPlan] = useState(false);
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
    <section id="plano-a-obra" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20 mb-4">
            Modelado 3D
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Del plano a la obra
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
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
              className="relative h-[380px] sm:h-[460px] lg:h-[540px] rounded-2xl border border-black/10 bg-panel-sunken bg-gradient-to-b from-panel-sunken to-panel shadow-lg overflow-hidden"
            >
              {showScene && !showPlan ? (
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

              {/*
                Conmutador plano / modelo. Al volver al 3D la escena se remonta y
                la animación se reproduce de nuevo, que es justo lo que se espera.
              */}
              {showScene && (
                <button
                  type="button"
                  onClick={() => setShowPlan((value) => !value)}
                  aria-pressed={showPlan}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-panel/95 px-3 py-1.5 text-xs font-medium text-primary-800 shadow-lg border border-black/10 transition-colors hover:text-accent-800 hover:border-accent-300"
                >
                  {showPlan ? (
                    <>
                      <svg className="h-4 w-4 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Ver modelo 3D
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                      </svg>
                      Cambiar a plano
                    </>
                  )}
                </button>
              )}

              {/* Repetir animación: solo tiene sentido con el modelo a la vista */}
              {sceneReady && !showPlan && !reducedMotion && (
                <button
                  type="button"
                  onClick={() => setReplayToken((token) => token + 1)}
                  className="absolute bottom-4 right-4 rounded-full bg-panel/95 px-3 py-1.5 text-xs font-medium text-primary-800 shadow-lg border border-black/10 transition-colors hover:text-accent-800 hover:border-accent-300"
                >
                  Repetir animación
                </button>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Vivienda de ejemplo de {PLAN.width} × {PLAN.depth} m ·{' '}
              {PLAN.width * PLAN.depth} m² construidos · patio de {PLAN.patio.depth} m al fondo
            </p>
          </div>

          {/* Proceso */}
          <div className="lg:col-span-2">
            <ol className="space-y-6">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-bold text-cyan-300 ring-1 ring-cyan-400/20">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-slate-400">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <Link to={ROUTES.CONTACT}>
                <Button variant="light" size="lg" className="w-full sm:w-auto">
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
