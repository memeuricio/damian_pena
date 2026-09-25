/**
 * Motivos y trazado del fondo: la parte pura, sin React ni canvas vivo.
 *
 * Está separado del componente a propósito: así se puede verificar la geometría
 * de cada motivo con un script de Node, sin navegador ni capturas.
 *
 * Reglas del trazado: cada figura tiene un progreso de 0 a 2.
 *   - de 0 a 1 se dibuja desde el principio hasta el final
 *   - de 1 a 2 el punto de partida avanza, así que la línea se consume por donde
 *     se trazó, no al revés
 * Una figura es una SECUENCIA de caminos, como los trazaría un plotter: primero
 * el contorno, después la carpintería.
 *
 * Criterio de los motivos: solo símbolos de dibujo técnico y volúmenes en
 * perspectiva isométrica. Nada figurativo.
 */

/** Espaciado de la retícula, en píxeles CSS. Es también la unidad de los motivos. */
export const GRID = 46;

/** Cuántas figuras hay a la vez. Discretas: son textura, no protagonista. */
export const FIGURE_COUNT = 12;

export const BACKGROUND = '#0a0e14';
export const GRID_COLOR = 'rgba(255, 255, 255, 0.035)';

/** Colores de capa, como los de AutoCAD, siempre a baja opacidad. */
const LAYER_COLORS = [
  '0, 214, 255', // cian
  '255, 255, 255', // blanco
  '255, 214, 102', // amarillo
  '126, 231, 135', // verde
  '255, 122, 209', // magenta
];

/** Pausa entre figuras, en segundos. Da el ritmo de "pluma que se levanta". */
const MIN_PAUSE = 2;
const MAX_PAUSE = 8;

/** Opacidad de los trazos. Discreta: no debe competir con el contenido. */
const MIN_ALPHA = 0.12;
const MAX_ALPHA = 0.28;

/**
 * Tamaño de las figuras. El mínimo es el de siempre; de vez en cuando salen
 * bastante más grandes. La distribución está sesgada hacia el pequeño (ver
 * SCALE_BIAS) para que las grandes sean la excepción y no la norma.
 */
const MIN_SCALE = 1;
const MAX_SCALE = 2.2;
const SCALE_BIAS = 1.8;

/**
 * Velocidad del trazado, en píxeles por segundo. Cuanto más larga la figura,
 * más rápido va la pluma, y de ahí sale la duración: si no, una figura grande
 * tardaría una eternidad o se dibujaría a toda prisa.
 */
const DRAW_SPEED_BASE = 20;
const DRAW_SPEED_PER_PIXEL = 0.03;
const MIN_DURATION = 8;
const MAX_DURATION = 40;

const random = (min, max) => min + Math.random() * (max - min);
const snap = (value, step = GRID) => Math.round(value / step) * step;

/* ------------------------------------------------------------- primitivas */

const polyline = (points) => ({ kind: 'polyline', points });

/** Rectángulo cerrado: el último punto repite el primero para que cierre. */
const rectangle = (x, y, width, height) =>
  polyline([
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
    { x, y },
  ]);

const segment = (x1, y1, x2, y2) =>
  polyline([
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ]);

const arc = (cx, cy, radius, from, to) => ({ kind: 'arc', cx, cy, radius, from, to });

/**
 * Elipse muestreada como polilínea. Con esto basta para los círculos en
 * perspectiva: el modelo de caminos solo necesita polilíneas y arcos, y la
 * elipse se recorre igual que cualquier otra línea.
 */
function ellipsePath(cx, cy, rx, ry, rotation = 0, steps = 30) {
  const points = [];
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    points.push({ x: cx + x * cos - y * sin, y: cy + x * sin + y * cos });
  }

  return polyline(points);
}

/** Cuadrado pequeño: las "grips" que AutoCAD dibuja en los vértices. */
const grip = (x, y, size = GRID * 0.16) =>
  rectangle(x - size, y - size, size * 2, size * 2);

/**
 * Achurado: líneas a 45° recortadas al rectángulo, como el relleno de un corte.
 * El recorte se resuelve en paramétricas sobre la diagonal v = u + c.
 */
function hatchPaths(x, y, width, height, spacing) {
  const paths = [rectangle(x, y, width, height)];

  for (let c = -width + spacing; c < height; c += spacing) {
    const start = Math.max(0, -c / width);
    const end = Math.min(1, (height - c) / width);
    if (end - start < 0.08) continue;

    paths.push(
      segment(x + start * width, y + c + start * width, x + end * width, y + c + end * width)
    );
  }

  return paths;
}

/* ----------------------------------------------------------------- motivos */

/**
 * Cada motivo devuelve una lista de caminos y el tamaño que ocupa. El tamaño
 * declarado debe CONTENER todo el dibujo: si se queda corto, la figura puede
 * colocarse pegada al borde y quedar cortada por la pantalla.
 */
export const MOTIFS = [
  /* ------------------------------------------------- símbolos de plano */

  /** Ventana en alzado: marco, cruceta y antepecho. */
  () => {
    const w = GRID * 1.3;
    const h = GRID * 1.1;
    return {
      // El antepecho sobresale del marco.
      width: w + GRID * 0.3,
      height: h + GRID * 0.3,
      paths: [
        rectangle(0, 0, w, h),
        segment(w / 2, 0, w / 2, h),
        segment(0, h / 2, w, h / 2),
        segment(-GRID * 0.15, h + GRID * 0.15, w + GRID * 0.15, h + GRID * 0.15),
      ],
    };
  },

  /** Puerta en planta: jamba, hoja abierta y arco de giro. */
  () => {
    const size = GRID * 1.5;
    return {
      width: size,
      height: size,
      paths: [
        segment(0, 0, 0, size),
        segment(0, 0, size, 0),
        arc(0, 0, size, 0, Math.PI / 2),
      ],
    };
  },

  /** Recinto en planta: muros con hueco de puerta y su arco de giro. */
  () => {
    const w = GRID * 3.4;
    const h = GRID * 2.6;
    const gap = GRID * 0.9;
    return {
      width: w,
      height: h,
      paths: [
        polyline([
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: h },
          { x: 0, y: h },
          { x: 0, y: 0 },
        ]),
        segment(w * 0.3, h, w * 0.3 + gap, h),
        arc(w * 0.3, h, gap, -Math.PI / 2, 0),
        segment(w * 0.3, h, w * 0.3, h - gap),
      ],
    };
  },

  /** Escalera en planta: dos zancas, peldaños y flecha de subida. */
  () => {
    const w = GRID * 1.3;
    const h = GRID * 3.2;
    const treads = 6;
    const paths = [segment(0, 0, 0, h), segment(w, 0, w, h)];

    for (let i = 1; i < treads; i++) {
      const y = (h / treads) * i;
      paths.push(segment(0, y, w, y));
    }
    paths.push(segment(w / 2, h, w / 2, GRID * 0.4));

    return { width: w, height: h, paths };
  },

  /** Cota acotada: líneas de referencia, línea de cota y marcas en los extremos. */
  () => {
    const w = GRID * 4;
    const tick = GRID * 0.35;
    return {
      width: w + GRID * 0.8,
      height: tick * 2,
      paths: [
        segment(0, 0, 0, tick * 2),
        segment(w, 0, w, tick * 2),
        segment(-GRID * 0.4, tick, w + GRID * 0.4, tick),
        segment(0, 0, tick, tick * 2),
        segment(w, 0, w - tick, tick * 2),
      ],
    };
  },

  /** Pilar o árbol en planta: círculo con cruz de ejes. */
  () => {
    const r = GRID * 0.7;
    return {
      width: r * 2,
      height: r * 2,
      paths: [
        arc(r, r, r, 0, Math.PI * 2),
        segment(0, r, r * 2, r),
        segment(r, 0, r, r * 2),
      ],
    };
  },

  /** Bóveda: arco de medio punto con su línea de arranque. */
  () => {
    const r = GRID * 1.1;
    return {
      width: r * 2,
      height: r,
      paths: [arc(r, r, r, Math.PI, Math.PI * 2), segment(0, r, r * 2, r)],
    };
  },

  /** Polilínea con grips: los cuadraditos que AutoCAD dibuja en los vértices. */
  () => {
    const points = [
      { x: 0, y: GRID * 1.6 },
      { x: GRID * 1.1, y: GRID * 1.6 },
      { x: GRID * 1.1, y: GRID * 0.4 },
      { x: GRID * 2.2, y: GRID * 0.4 },
      { x: GRID * 2.2, y: GRID * 1.3 },
      { x: GRID * 2.8, y: GRID * 1.3 },
    ];

    return {
      width: GRID * 3.2,
      height: GRID * 2,
      paths: [polyline(points), ...points.map((point) => grip(point.x, point.y))],
    };
  },

  /** Achurado: relleno de líneas a 45°, como el interior de un corte. */
  () => {
    const w = GRID * 2.4;
    const h = GRID * 1.6;
    return { width: w, height: h, paths: hatchPaths(0, 0, w, h, GRID * 0.38) };
  },

  /** Burbuja de eje: círculo con cruz y línea de eje. */
  () => {
    const r = GRID * 0.65;
    const tail = GRID * 1.8;
    return {
      width: r * 2 + tail,
      height: r * 2,
      paths: [
        arc(r, r, r, 0, Math.PI * 2),
        segment(r, r - r * 0.5, r, r + r * 0.5),
        segment(r * 2, r, r * 2 + tail, r),
      ],
    };
  },

  /** Cota de nivel: triángulo de nivel atravesado por su línea. */
  () => {
    const w = GRID * 1.2;
    const h = GRID * 0.9;
    const lineWidth = GRID * 2.6;
    return {
      width: lineWidth,
      height: h + GRID * 0.2,
      paths: [
        polyline([
          { x: 0, y: h },
          { x: w / 2, y: 0 },
          { x: w, y: h },
          { x: 0, y: h },
        ]),
        segment(0, h * 0.55, lineWidth, h * 0.55),
      ],
    };
  },

  /** Marca de sección o referencia: círculo, línea y flecha. */
  () => {
    const r = GRID * 0.55;
    const length = GRID * 2.8;
    const head = GRID * 0.45;
    const tip = r * 2 + length;

    return {
      width: tip,
      height: r * 2 + head,
      paths: [
        arc(r, r, r, 0, Math.PI * 2),
        segment(r * 2, r, tip, r),
        polyline([
          { x: tip - head, y: r - head * 0.6 },
          { x: tip, y: r },
          { x: tip - head, y: r + head * 0.6 },
        ]),
      ],
    };
  },

  /** Flecha norte: círculo, aguja y cola. */
  () => {
    const r = GRID * 0.95;
    return {
      width: r * 2,
      height: r * 2,
      paths: [
        arc(r, r, r, 0, Math.PI * 2),
        polyline([
          { x: r, y: r * 0.3 },
          { x: r * 1.6, y: r * 1.35 },
          { x: r, y: r * 1.05 },
          { x: r * 0.4, y: r * 1.35 },
          { x: r, y: r * 0.3 },
        ]),
        segment(r, r * 1.05, r, r * 1.75),
      ],
    };
  },

  /** Spline: curva continua con sus puntos de control marcados. */
  () => {
    // El trazado se inserta un poco hacia dentro para que las grips de los
    // extremos no queden en negativo.
    const inset = GRID * 0.2;
    const points = [];
    const steps = 26;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      points.push({
        x: inset + t * GRID * 3,
        // La senoide baja más de lo que parece: se declara la caja con su
        // recorrido completo, o la figura puede colocarse fuera del lienzo.
        y: inset + GRID * 0.75 - Math.sin(t * Math.PI * 1.3) * GRID * 0.75,
      });
    }

    const controls = [points[0], points[Math.round(steps / 2)], points[steps]];

    return {
      width: GRID * 3.4,
      height: GRID * 1.95,
      paths: [polyline(points), ...controls.map((point) => grip(point.x, point.y))],
    };
  },

  /** Curvas de nivel: anillos concéntricos irregulares, como un levantamiento. */
  () => {
    const paths = [];

    for (let ring = 0; ring < 3; ring++) {
      const rx = GRID * 0.75 + ring * GRID * 0.5;
      const ry = rx * 0.62;
      const points = [];

      for (let i = 0; i <= 34; i++) {
        const angle = (i / 34) * Math.PI * 2;
        const wobble = 1 + 0.14 * Math.sin(angle * 3 + ring * 1.7);
        points.push({
          x: rx + Math.cos(angle) * rx * wobble,
          y: ry + Math.sin(angle) * ry * wobble,
        });
      }

      paths.push(polyline(points));
    }

    return { width: GRID * 4.1, height: GRID * 2.6, paths };
  },

  /* ------------------------------------- volúmenes en perspectiva isométrica */

  /** Cubo isométrico: cara superior romboidal y dos caras laterales. */
  () => {
    const w = GRID * 1.5;
    const h = w * 0.5;
    const depth = GRID * 1.5;

    const top = { x: w, y: 0 };
    const right = { x: w * 2, y: h };
    const bottom = { x: w, y: h * 2 };
    const left = { x: 0, y: h };

    const drop = (point) => ({ x: point.x, y: point.y + depth });

    return {
      width: w * 2,
      height: h * 2 + depth,
      paths: [
        polyline([top, right, bottom, left, top]),
        polyline([left, bottom, drop(bottom), drop(left), left]),
        polyline([bottom, right, drop(right), drop(bottom), bottom]),
      ],
    };
  },

  /** Cilindro isométrico: dos elipses y sus generatrices. */
  () => {
    const rx = GRID * 1.05;
    const ry = rx * 0.5;
    const height = GRID * 1.7;

    return {
      width: rx * 2,
      height: ry * 2 + height,
      paths: [
        ellipsePath(rx, ry, rx, ry),
        segment(0, ry, 0, ry + height),
        segment(rx * 2, ry, rx * 2, ry + height),
        ellipsePath(rx, ry + height, rx, ry),
      ],
    };
  },

  /** Pirámide isométrica: base romboidal y aristas a la cúspide. */
  () => {
    const w = GRID * 1.25;
    const h = w * 0.5;
    const apexHeight = GRID * 2;

    const apex = { x: w, y: 0 };
    const right = { x: w * 2, y: apexHeight + h };
    const bottom = { x: w, y: apexHeight + h * 2 };
    const left = { x: 0, y: apexHeight + h };

    return {
      width: w * 2,
      height: apexHeight + h * 2,
      paths: [
        polyline([{ x: w, y: apexHeight }, right, bottom, left, { x: w, y: apexHeight }]),
        segment(apex.x, apex.y, left.x, left.y),
        segment(apex.x, apex.y, right.x, right.y),
      ],
    };
  },

  /** Esfera: círculo con el ecuador marcado. */
  () => {
    const r = GRID * 0.95;
    return {
      width: r * 2,
      height: r * 2,
      paths: [ellipsePath(r, r, r, r), ellipsePath(r, r, r, r * 0.32)],
    };
  },
];

/* ------------------------------------------------------------- medición */

function measurePath(path) {
  if (path.kind === 'arc') {
    return { ...path, total: path.radius * Math.abs(path.to - path.from) };
  }

  const lengths = [];
  let total = 0;

  for (let i = 0; i < path.points.length - 1; i++) {
    const length = Math.hypot(
      path.points[i + 1].x - path.points[i].x,
      path.points[i + 1].y - path.points[i].y
    );
    lengths.push(length);
    total += length;
  }

  return { ...path, lengths, total };
}

/** Escala un camino alrededor de su origen. */
function scalePath(path, scale) {
  if (path.kind === 'arc') {
    return {
      ...path,
      cx: path.cx * scale,
      cy: path.cy * scale,
      radius: path.radius * scale,
    };
  }

  return { ...path, points: path.points.map((point) => ({ x: point.x * scale, y: point.y * scale })) };
}

/**
 * Coloca un motivo al azar y devuelve la figura lista para trazar.
 *
 * El tamaño varía: el mínimo es el original y de vez en cuando salen mucho más
 * grandes. El tope se recorta solo si la figura no cabría en el lienzo, para que
 * nunca aparezca cortada por el borde.
 */
export function createFigure(width, height) {
  const motif = MOTIFS[Math.floor(Math.random() * MOTIFS.length)]();
  const margin = GRID;

  const fitsWidth = (width - margin * 2) / motif.width;
  const fitsHeight = (height - margin * 2) / motif.height;
  const scaleLimit = Math.max(MIN_SCALE, Math.min(MAX_SCALE, fitsWidth, fitsHeight));

  const scale = Math.min(
    scaleLimit,
    MIN_SCALE + (MAX_SCALE - MIN_SCALE) * Math.pow(Math.random(), SCALE_BIAS)
  );

  const figureWidth = motif.width * scale;
  const figureHeight = motif.height * scale;

  const originX = snap(random(margin, Math.max(margin, width - figureWidth - margin)));
  const originY = snap(random(margin, Math.max(margin, height - figureHeight - margin)));

  const paths = motif.paths.map((path) => {
    const scaled = scalePath(path, scale);

    if (scaled.kind === 'arc') {
      return measurePath({ ...scaled, cx: scaled.cx + originX, cy: scaled.cy + originY });
    }
    return measurePath({
      ...scaled,
      points: scaled.points.map((point) => ({ x: point.x + originX, y: point.y + originY })),
    });
  });

  const total = paths.reduce((sum, path) => sum + path.total, 0);
  const color = LAYER_COLORS[Math.floor(Math.random() * LAYER_COLORS.length)];

  // Una figura grande ocupa mucha más superficie: se le baja un poco la
  // opacidad para que siga siendo textura y no protagonista.
  const presence = 1 / (1 + (scale - MIN_SCALE) * 0.35);

  // La pluma va más rápido cuanto más largo es el recorrido, así el trazado no
  // se eterniza ni se dibuja a toda prisa.
  const speed = DRAW_SPEED_BASE + total * DRAW_SPEED_PER_PIXEL;

  return {
    paths,
    total,
    color: `rgba(${color}, ${(random(MIN_ALPHA, MAX_ALPHA) * presence).toFixed(3)})`,
    lineWidth: random(0.9, 1.5),
    duration: Math.min(MAX_DURATION, Math.max(MIN_DURATION, total / speed)),
    pause: random(MIN_PAUSE, MAX_PAUSE),
    elapsed: 0,
  };
}

/* ------------------------------------------------------------- trazado */

/** Dibuja la parte del camino que cae en el intervalo [from, to] de su recorrido. */
function drawPathSlice(context, path, from, to) {
  if (to <= from) return;

  context.beginPath();

  if (path.kind === 'arc') {
    const sweep = path.to - path.from;
    context.arc(
      path.cx,
      path.cy,
      path.radius,
      path.from + sweep * from,
      path.from + sweep * to
    );
    context.stroke();
    return;
  }

  const { points, lengths, total } = path;
  const startDistance = from * total;
  const endDistance = to * total;

  let travelled = 0;
  let started = false;

  for (let i = 0; i < points.length - 1; i++) {
    const segmentLength = lengths[i];
    const segmentStart = travelled;
    const segmentEnd = travelled + segmentLength;
    travelled = segmentEnd;

    if (segmentLength === 0) continue;
    if (segmentEnd < startDistance) continue;
    if (segmentStart > endDistance) break;

    const localFrom = Math.max(0, startDistance - segmentStart) / segmentLength;
    const localTo = Math.min(segmentLength, endDistance - segmentStart) / segmentLength;

    const a = points[i];
    const b = points[i + 1];
    const x0 = a.x + (b.x - a.x) * localFrom;
    const y0 = a.y + (b.y - a.y) * localFrom;
    const x1 = a.x + (b.x - a.x) * localTo;
    const y1 = a.y + (b.y - a.y) * localTo;

    if (!started) {
      context.moveTo(x0, y0);
      started = true;
    } else {
      context.lineTo(x0, y0);
    }
    context.lineTo(x1, y1);
  }

  context.stroke();
}

/**
 * Dibuja la figura entera en el estado que marca `progress` (0 a 2).
 * Los caminos se recorren en orden, encadenando sus longitudes: el plotter
 * termina un contorno y sigue con el siguiente sin levantar la pluma.
 */
export function drawFigure(context, figure, progress) {
  const from = Math.max(0, progress - 1);
  const to = Math.min(1, progress);
  if (to <= from) return;

  const startDistance = from * figure.total;
  const endDistance = to * figure.total;

  let travelled = 0;

  for (const path of figure.paths) {
    const pathStart = travelled;
    const pathEnd = travelled + path.total;
    travelled = pathEnd;

    if (pathEnd < startDistance) continue;
    if (pathStart > endDistance) break;
    if (path.total === 0) continue;

    const localFrom = Math.max(0, startDistance - pathStart) / path.total;
    const localTo = Math.min(path.total, endDistance - pathStart) / path.total;

    drawPathSlice(context, path, localFrom, localTo);
  }
}

/** Retícula tenue, como la del espacio modelo. */
export function drawGrid(context, width, height) {
  context.strokeStyle = GRID_COLOR;
  context.lineWidth = 1;
  context.beginPath();

  for (let x = GRID; x < width; x += GRID) {
    context.moveTo(Math.round(x) + 0.5, 0);
    context.lineTo(Math.round(x) + 0.5, height);
  }
  for (let y = GRID; y < height; y += GRID) {
    context.moveTo(0, Math.round(y) + 0.5);
    context.lineTo(width, Math.round(y) + 0.5);
  }

  context.stroke();
}
