/**
 * Plano de la vivienda de ejemplo que se muestra en 3D.
 *
 * Coordenadas en metros sobre el plano XZ: x hacia la derecha, z hacia abajo.
 * Es la única fuente de verdad: el modelo 3D y el plano SVG de respaldo se
 * generan a partir de estos mismos datos, así que siempre coinciden.
 *
 * Para cambiar la casa, edita `walls` (muros) y `rooms` (recintos).
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
