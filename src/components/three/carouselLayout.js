/**
 * Geometría del carrusel de proyectos.
 *
 * Vive aparte de la escena 3D a propósito: este módulo no importa three.js, así
 * que la sección puede usarlo (para saber cuánto hay que arrastrar por paso) sin
 * arrastrar el bundle de three a la carga inicial.
 */

/**
 * Radio de la circunferencia sobre la que se colocan las maquetas, en unidades.
 *
 * Es grande a propósito: con 9 elementos, un radio pequeño curvaba tanto el
 * abanico que las piezas de los extremos quedaban muy atrás (diminutas) y sus
 * placas casi de canto. Un radio grande deja un arco suave: todas las piezas a
 * una profundidad parecida, como en el selector de Isaac.
 */
export const RADIUS = 7.5;

/** Separación máxima entre piezas contiguas (radianes). */
const MAX_STEP = 0.55;

/** Apertura máxima del abanico. */
const MAX_SPREAD = 0.55;

/** En pantallas estrechas el abanico se cierra, pero no tanto como para que las
 *  piezas se solapen: con 9 elementos hace falta algo más de una décima de radian
 *  entre contiguas para que la peana de la seleccionada no pise a la vecina. */
const NARROW_STEP = 0.48;
const NARROW_SPREAD = 0.48;

/** Cuántos píxeles hay que arrastrar para avanzar una pieza. */
export const DRAG_PIXELS_PER_STEP = 110;

/** A partir de este movimiento se considera arrastre y no clic. */
export const DRAG_THRESHOLD = 6;

/**
 * Separación angular entre piezas. Se reduce cuando hay muchas para que todas
 * quepan dentro del abanico visible.
 */
export function carouselStep(count, narrow = false) {
  if (count <= 1) return 0;
  const stepLimit = narrow ? NARROW_STEP : MAX_STEP;
  const spreadLimit = narrow ? NARROW_SPREAD : MAX_SPREAD;
  return Math.min(stepLimit, (2 * spreadLimit) / (count - 1));
}

/**
 * Posición de cada tarjeta relativa a la seleccionada.
 *
 * El desfase se envuelve alrededor de la circunferencia, así las tarjetas
 * siempre se reparten simétricamente a ambos lados de la seleccionada. Con 3
 * proyectos y el índice 0 seleccionado, los desfases son 0, +1 y -1.
 */
export function carouselOffsets(count, selectedIndex) {
  return Array.from({ length: count }, (_, index) => {
    const wrapped = (((index - selectedIndex + count / 2) % count) + count) % count;
    return wrapped - count / 2;
  });
}

/**
 * Estado objetivo de cada tarjeta: posición, giro, escala y niveles de opacidad.
 * La escena interpola hacia estos valores fotograma a fotograma.
 *
 * IMPORTANTE: x e z son coordenadas LOCALES al centro de la circunferencia. La
 * escena coloca el grupo giratorio en (0, 0, -RADIUS), así que restarle RADIUS a
 * z aquí lo restaba dos veces: las tarjetas acababan 4,2 unidades más lejos y se
 * veían la mitad de grandes.
 */
export function carouselTargets(count, selectedIndex, narrow = false) {
  const step = carouselStep(count, narrow);

  return carouselOffsets(count, selectedIndex).map((offset) => {
    const angle = offset * step;
    const selected = offset === 0;

    return {
      angle,
      x: RADIUS * Math.sin(angle),
      z: RADIUS * Math.cos(angle),
      y: selected ? 0.16 : 0,
      // El seleccionado mide exactamente 125% de los demás.
      scale: selected ? 1 : 0.8,
      // Las no seleccionadas se atenúan, como en el selector de Isaac.
      opacity: selected ? 1 : 0.55,
      tint: selected ? 1 : 0.78,
      glow: selected ? 1 : 0,
      shadow: selected ? 0.9 : 0.45,
      selected,
    };
  });
}

/**
 * Encuadre que la cámara necesita para que quepa todo.
 * `lookAtY` es la altura a la que mira: la pieza va de la placa (abajo) a la
 * punta de la maqueta (arriba), así que el centro óptico no está en el suelo.
 */
export function carouselBounds(count, narrow = false) {
  const targets = carouselTargets(count, 0, narrow);
  const widest = targets.reduce((max, t) => Math.max(max, Math.abs(t.x)), 0);

  return {
    halfWidth: widest + 0.52,
    halfHeight: 1.02,
    lookAtY: 0.26,
  };
}
