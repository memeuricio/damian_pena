import { useEffect, useRef } from 'react';
import { BACKGROUND, FIGURE_COUNT, createFigure, drawFigure, drawGrid } from './backgroundMotifs';

/**
 * Fondo del sitio: un "espacio modelo" oscuro donde un plotter traza planos sin
 * parar. Los motivos y el trazado viven en `backgroundMotifs.js`.
 *
 * Está hecho con canvas 2D y no con three.js a propósito: es un fondo, no debe
 * costar un chunk de 240 KB. Un solo canvas, sin nodos en el DOM y sin trabajo
 * cuando la pestaña no se ve.
 */
export default function SiteBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let figures = [];
    let frame = 0;
    let previousTime = 0;
    let resizeTimer = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      figures = Array.from({ length: FIGURE_COUNT }, () => {
        const figure = createFigure(width, height);
        // Al montar sí se reparte el ciclo, para que no empiecen todas a la vez.
        figure.elapsed = Math.random() * (figure.duration + figure.pause);
        return figure;
      });
    };

    const paint = (time) => {
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.1) : 0;
      previousTime = time;

      context.fillStyle = BACKGROUND;
      context.fillRect(0, 0, width, height);
      drawGrid(context, width, height);

      context.lineCap = 'round';
      context.lineJoin = 'round';

      for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];

        if (reduceMotion) {
          context.strokeStyle = figure.color;
          context.lineWidth = figure.lineWidth;
          drawFigure(context, figure, 1);
          continue;
        }

        // `elapsed` puede empezar en negativo: es la espera antes de trazar, así
        // la figura nueva nunca aparece a medias de golpe.
        figure.elapsed += delta;

        if (figure.elapsed >= figure.duration + figure.pause) {
          const next = createFigure(width, height);
          next.elapsed = -Math.random() * 3;
          figures[i] = next;
          continue;
        }

        const progress =
          figure.elapsed < 0
            ? 0
            : Math.min((figure.elapsed / figure.duration) * 2, 2);

        context.strokeStyle = figure.color;
        context.lineWidth = figure.lineWidth;
        drawFigure(context, figure, progress);
      }

      frame = window.requestAnimationFrame(paint);
    };

    const start = () => {
      if (frame) return;
      previousTime = 0;
      frame = window.requestAnimationFrame(paint);
    };

    const stop = () => {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 350);
    };

    resize();
    start();

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
