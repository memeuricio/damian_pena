/**
 * Plano de la vivienda de ejemplo que se muestra en 3D.
 *
 * Coordenadas en metros sobre el plano XZ: x hacia la derecha, z hacia abajo.
 * Es la única fuente de verdad: el modelo 3D y el plano SVG de respaldo se
 * generan a partir de estos mismos datos, así que siempre coinciden.
 *
 * Para cambiar la casa, edita `walls` (muros), `openings` (puertas y ventanas)
 * y `rooms` (recintos).
 */
export const PLAN = {
  width: 10,
  depth: 8,

  wallThickness: 0.18,

  /**
   * Altura del muro en el modelo. No es el alto real de la casa (2,6 m): es un
   * corte tipo maqueta arquitectónica, para que se vea la distribución por dentro.
   */
  wallHeight: 1.35,

  /**
   * Altura del antepecho de las ventanas en el modelo 3D: de ahí hacia arriba
   * el hueco se llena con un vidrio. En el plano SVG las ventanas se dibujan
   * como una línea fina dentro del hueco del muro.
   */
  windowSill: 0.9,

  baseThickness: 0.18,
  baseMargin: 0.6,

  /**
   * Muros como segmentos [x1, z1, x2, z2].
   * Los cuatro primeros son el perímetro; el resto, tabiques interiores.
   * El orden importa: la animación los dibuja en esta secuencia.
   */
  walls: [
    [0, 0, 10, 0],
    [10, 0, 10, 8],
    [10, 8, 0, 8],
    [0, 8, 0, 0],
    [4, 0, 4, 8],
    [0, 5, 4, 5],
    [4, 4.5, 10, 4.5],
  ],

  /**
   * Aberturas en los muros: puertas y ventanas.
   *
   * `wall` es el índice en `walls`. `from` y `to` son las coordenadas [x, z]
   * de los extremos del hueco, siempre sobre la línea del muro (el orden de
   * los extremos no importa).
   *
   * `type` es 'door' o 'window'. En las puertas, `hinge` dice en qué extremo
   * del hueco va la bisagra ('start' o 'end', según el sentido en que está
   * dibujado el muro) y `side` hacia qué lado abre la hoja (1 o -1, mirando
   * el muro en su dirección de dibujo); ambos solo se usan para dibujar el
   * arco de giro en el plano SVG.
   *
   * OJO: estas posiciones son de la vivienda de ejemplo. Antes de usarlas en
   * un proyecto real, revisa la circulación y ajusta los números.
   */
  openings: [
    // Puerta de acceso — fachada delantera, entra al living comedor
    { wall: 0, from: [6.4, 0], to: [7.4, 0], type: 'door', hinge: 'end', side: -1 },
    // Puerta posterior de la cocina hacia el patio
    { wall: 2, from: [8.4, 8], to: [9.2, 8], type: 'door', hinge: 'start', side: -1 },
    // Living comedor ↔ cocina
    { wall: 6, from: [6.5, 4.5], to: [7.5, 4.5], type: 'door', hinge: 'start', side: 1 },
    // Living comedor ↔ dormitorio
    { wall: 4, from: [4, 1.4], to: [4, 2.3], type: 'door', hinge: 'end', side: 1 },
    // Dormitorio ↔ baño + lavandería (suite)
    { wall: 5, from: [1.5, 5], to: [2.3, 5], type: 'door', hinge: 'start', side: 1 },
    // Ventana del dormitorio — fachada delantera
    { wall: 0, from: [0.8, 0], to: [2.0, 0], type: 'window' },
    // Ventana del dormitorio — costado izquierdo
    { wall: 3, from: [0, 0.5], to: [0, 1.5], type: 'window' },
    // Ventana del living comedor — fachada delantera
    { wall: 0, from: [8.2, 0], to: [9.6, 0], type: 'window' },
    // Ventana del living comedor — costado derecho
    { wall: 1, from: [10, 0.8], to: [10, 2.0], type: 'window' },
    // Ventana de la cocina — costado derecho
    { wall: 1, from: [10, 5.8], to: [10, 7.0], type: 'window' },
    // Ventana del baño — costado izquierdo
    { wall: 3, from: [0, 6.6], to: [0, 7.5], type: 'window' },
  ],

  /** Etiquetas que aparecen dentro del modelo al terminar la animación. */
  rooms: [
    { name: 'Dormitorio', area: '20 m²', x: 2, z: 2.5 },
    { name: 'Baño + lavandería', area: '12 m²', x: 2, z: 6.5 },
    { name: 'Living comedor', area: '27 m²', x: 7, z: 2.25 },
    { name: 'Cocina', area: '21 m²', x: 7, z: 6.25 },
  ],
};

/**
 * Duración de cada fase de la animación, en segundos.
 * Ver BuildingScene.jsx.
 */
export const TIMELINE = {
  draw: 1.8,        // se traza el plano
  raiseStart: 1.5,  // los muros empiezan a levantarse
  raise: 1.1,       // duración del levantamiento de cada muro
  stagger: 0.09,    // desfase entre muro y muro
  labelsStart: 2.8, // aparecen los nombres de los recintos
  labels: 0.7,
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));

/** Fracción del muro en la que cae un punto, recortada a [0, 1]. */
function intervalOnWall([x1, z1, x2, z2], point) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const lengthSquared = dx * dx + dz * dz;
  if (lengthSquared === 0) return 0;
  return clamp01(((point[0] - x1) * dx + (point[1] - z1) * dz) / lengthSquared);
}

/** Punto del muro a la fracción `t` (0 = inicio, 1 = fin). */
function pointAt([x1, z1, x2, z2], t) {
  return [x1 + (x2 - x1) * t, z1 + (z2 - z1) * t];
}

/**
 * Aberturas de cada muro con sus extremos proyectados sobre él. `a`/`b` son
 * las fracciones del muro (0 a 1) y (x1, z1)-(x2, z2) los extremos del hueco
 * en coordenadas del plano, con (x1, z1) siempre del lado del inicio del muro.
 * Las aberturas solapadas se fusionan.
 */
export function openingsByWall(walls = PLAN.walls, openings = PLAN.openings) {
  return walls.map((segment, wallIndex) => {
    const projected = openings
      .filter((opening) => opening.wall === wallIndex)
      .map((opening) => {
        const [a, b] = [intervalOnWall(segment, opening.from), intervalOnWall(segment, opening.to)].sort((p, q) => p - q);
        return { ...opening, a, b };
      })
      .sort((p, q) => p.a - q.a);

    const merged = [];
    for (const opening of projected) {
      const previous = merged[merged.length - 1];
      if (previous && opening.a <= previous.b) {
        previous.b = Math.max(previous.b, opening.b);
      } else {
        merged.push(opening);
      }
    }

    return merged.map((opening) => {
      const [x1, z1] = pointAt(segment, opening.a);
      const [x2, z2] = pointAt(segment, opening.b);
      return { ...opening, x1, z1, x2, z2 };
    });
  });
}

/**
 * Tramos sólidos de cada muro después de quitar las aberturas. Devuelve, por
 * muro, una lista de segmentos [x1, z1, x2, z2] en coordenadas del plano.
 * Es la fuente única del modelo 3D y del plano SVG: los huecos de puertas y
 * ventanas siempre coinciden en ambos.
 */
export function solidWallPieces(walls = PLAN.walls, openings = PLAN.openings) {
  const byWall = openingsByWall(walls, openings);

  return walls.map((segment, wallIndex) => {
    const pieces = [];
    let cursor = 0;

    for (const opening of byWall[wallIndex]) {
      if (opening.a > cursor) {
        pieces.push([...pointAt(segment, cursor), ...pointAt(segment, opening.a)]);
      }
      cursor = Math.max(cursor, opening.b);
    }

    if (cursor < 1) {
      pieces.push([...pointAt(segment, cursor), ...pointAt(segment, 1)]);
    }

    return pieces;
  });
}

/** Convierte un segmento de muro en los datos que necesita una caja 3D. */
export function wallToBox([x1, z1, x2, z2], thickness) {
  const dx = x2 - x1;
  const dz = z2 - z1;

  return {
    // Se alarga media pared por lado para que las esquinas queden macizas.
    length: Math.hypot(dx, dz) + thickness,
    position: [(x1 + x2) / 2, 0, (z1 + z2) / 2],
    rotationY: Math.atan2(-dz, dx),
  };
}

/**
 * Divide un muro en tramos cortos para que la animación de trazado sea fluida
 * (el drawRange de three.js avanza de vértice en vértice, no de muro en muro).
 */
export function wallToDrawSegments([x1, z1, x2, z2], step = 0.14) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const length = Math.hypot(dx, dz);
  const divisions = Math.max(1, Math.ceil(length / step));
  const points = [];

  for (let i = 0; i < divisions; i++) {
    const t0 = i / divisions;
    const t1 = (i + 1) / divisions;
    points.push(
      x1 + dx * t0, z1 + dz * t0,
      x1 + dx * t1, z1 + dz * t1
    );
  }

  return points;
}