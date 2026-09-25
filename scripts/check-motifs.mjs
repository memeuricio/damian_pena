/**
 * Verificación de la geometría de los motivos del fondo.
 * Se ejecuta con: node scripts/check-motifs.mjs
 *
 * Comprueba que ningún motivo pueda salirse de la caja que declara —si se queda
 * corta, la figura se coloca pegada al borde y se ve recortada por la pantalla—
 * y que el trazado no reviente en ningún estado del progreso.
 */
import { GRID, MOTIFS, createFigure, drawFigure } from '../src/components/layout/backgroundMotifs.js';

const CANVAS = { width: 1440, height: 900 };
let failures = 0;

const check = (label, condition, detail = '') => {
  if (!condition) {
    failures++;
    console.log(`  FALLA  ${label} ${detail}`);
  } else {
    console.log(`  ok     ${label} ${detail}`);
  }
};

/** Caja que ocupa realmente el dibujo de un motivo. */
function boundsOf(paths) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const add = (x, y) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  for (const path of paths) {
    if (path.kind === 'arc') {
      // Se muestrea el ARCO, no el círculo completo: un cuarto de círculo no
      // ocupa lo mismo que la circunferencia entera.
      const steps = 40;
      for (let s = 0; s <= steps; s++) {
        const angle = path.from + (path.to - path.from) * (s / steps);
        add(path.cx + Math.cos(angle) * path.radius, path.cy + Math.sin(angle) * path.radius);
      }
      continue;
    }
    for (const point of path.points) add(point.x, point.y);
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

console.log(`\n${MOTIFS.length} motivos\n`);

for (let i = 0; i < MOTIFS.length; i++) {
  const motif = MOTIFS[i]();
  const bounds = boundsOf(motif.paths);

  const finite = motif.paths.every((path) =>
    path.kind === 'arc'
      ? [path.cx, path.cy, path.radius, path.from, path.to].every(Number.isFinite)
      : path.points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
  );

  const totalLength = motif.paths.reduce((sum, path) => {
    if (path.kind === 'arc') return sum + path.radius * Math.abs(path.to - path.from);
    let length = 0;
    for (let p = 0; p < path.points.length - 1; p++) {
      length += Math.hypot(
        path.points[p + 1].x - path.points[p].x,
        path.points[p + 1].y - path.points[p].y
      );
    }
    return sum + length;
  }, 0);

  const overflowX = bounds.maxX - motif.width;
  const overflowY = bounds.maxY - motif.height;
  // Un motivo puede sobresalir un poco hacia negativo (el antepecho de la
  // ventana, las marcas de la cota). Lo absorbe el margen de colocación, que es
  // una retícula entera, pero no puede pasarse de media.
  const underflow = Math.max(0, -bounds.minX, -bounds.minY);

  console.log(`#${i + 1} ${motif.paths.length} caminos · ${Math.round(totalLength)} px`);
  check('coordenadas finitas', finite);
  check('recorrido con longitud', totalLength > 20, `${Math.round(totalLength)} px`);
  check(
    'la caja declarada contiene el dibujo',
    overflowX <= 0.5 && overflowY <= 0.5,
    `sobra x=${overflowX.toFixed(1)} y=${overflowY.toFixed(1)}`
  );
  check(
    'el saliente cabe en el margen',
    underflow <= GRID / 2,
    `saliente=${underflow.toFixed(1)} px`
  );
  check(
    'no tapa toda la pantalla',
    motif.width < CANVAS.width * 0.45 && motif.height < CANVAS.height * 0.45
  );
}

/* --- colocación, tamaño y trazado --- */
console.log('\nColocación, tamaño y trazado');

// En móvil el lienzo es estrecho: el tope de escala tiene que recortarse solo o
// las figuras grandes saldrían cortadas por el borde.
for (const canvas of [
  { width: 1440, height: 900, label: 'escritorio 1440x900' },
  { width: 390, height: 700, label: 'móvil 390x700' },
]) {
  let inside = true;
  for (let attempt = 0; attempt < 400; attempt++) {
    const figure = createFigure(canvas.width, canvas.height);
    const bounds = boundsOf(figure.paths);

    if (
      bounds.minX < -0.5 ||
      bounds.minY < -0.5 ||
      bounds.maxX > canvas.width + 0.5 ||
      bounds.maxY > canvas.height + 0.5
    ) {
      inside = false;
      console.log(
        `  fuera de lienzo: x ${bounds.minX.toFixed(0)}..${bounds.maxX.toFixed(0)}, y ${bounds.minY.toFixed(0)}..${bounds.maxY.toFixed(0)}`
      );
      break;
    }
  }
  check(`400 figuras caen dentro del lienzo (${canvas.label})`, inside);
}

// El tamaño tiene que variar: antes todas medían lo mismo
const sizes = [];
const durations = [];
const alphas = [];

for (let i = 0; i < 500; i++) {
  const figure = createFigure(1440, 900);
  const bounds = boundsOf(figure.paths);
  sizes.push(Math.max(bounds.width, bounds.height));
  durations.push(figure.duration);
  alphas.push(Number(figure.color.split(', ').pop().replace(')', '')));
}

const smallest = Math.min(...sizes);
const largest = Math.max(...sizes);
const largestMotif = Math.max(...MOTIFS.map((motif) => Math.max(motif().width, motif().height)));

check(
  'el tamaño varía',
  largest > smallest * 2,
  `menor ${smallest.toFixed(0)} px · mayor ${largest.toFixed(0)} px`
);
check(
  'la escala se aplica de verdad',
  largest > largestMotif,
  `mayor figura ${largest.toFixed(0)} px vs motivo mayor sin escalar ${largestMotif.toFixed(0)} px`
);
check(
  'la duración se mantiene en rango',
  Math.min(...durations) >= 8 && Math.max(...durations) <= 40,
  `${Math.min(...durations).toFixed(1)} s a ${Math.max(...durations).toFixed(1)} s`
);
check(
  'la opacidad se mantiene discreta',
  Math.min(...alphas) > 0.05 && Math.max(...alphas) <= 0.28,
  `${Math.min(...alphas).toFixed(3)} a ${Math.max(...alphas).toFixed(3)}`
);

// El trazado no debe lanzar en ningún estado, incluidos los límites
const context = new Proxy(
  {},
  {
    get: (_, key) => {
      if (key === 'beginPath' || key === 'moveTo' || key === 'lineTo' || key === 'stroke' || key === 'arc' || key === 'fillRect') {
        return () => {};
      }
      return undefined;
    },
    set: () => true,
  }
);

let threw = null;
try {
  for (let attempt = 0; attempt < 200; attempt++) {
    const figure = createFigure(1440, 900);
    for (const progress of [0, 0.001, 0.5, 1, 1.5, 2, 2.5]) {
      drawFigure(context, figure, progress);
    }
  }
} catch (error) {
  threw = error.message;
}
check('drawFigure aguanta cualquier progreso', !threw, threw ?? '');

console.log(`\n${failures === 0 ? 'TODO OK' : `${failures} FALLOS`}\n`);
process.exitCode = failures === 0 ? 0 : 1;
