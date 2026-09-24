/**
 * Geometría del carrusel de proyectos.
 *
 * Vive aparte de la escena 3D a propósito: este módulo no importa three.js, así
 * que la sección puede usarlo (para saber cuánto hay que arrastrar por paso) sin
 * arrastrar el bundle de three a la carga inicial.
 */

/** Radio de la circunferencia sobre la que se colocan las tarjetas, en unidades. */
export const RADIUS = 4.2;

/** Separación máxima entre tarjetas contiguas (radianes). */
const MAX_STEP = 0.62;

/** Apertura máxima del abanico, para que ninguna tarjeta se vaya por detrás (radianes). */
const MAX_SPREAD = 1.35;

/** Cuántos píxeles hay que arrastrar para avanzar una tarjeta. */
export const DRAG_PIXELS_PER_STEP = 110;

/** A partir de este movimiento se considera arrastre y no clic. */
export const DRAG_THRESHOLD = 6;

/**
 * Separación angular entre tarjetas. Se reduce cuando hay muchas para que todas
 * quepan dentro del abanico visible.
 */
export function carouselStep(count, narrow = false) {
  if (count <= 1) return 0;
  const preferred = narrow ? 0.46 : MAX_STEP;
  return Math.min(preferred, (2 * MAX_SPREAD) / (count - 1));
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
      scale: selected ? 1 : 0.84,
      // Las no seleccionadas se atenúan, como en el selector de Isaac.
      opacity: selected ? 1 : 0.55,
      tint: selected ? 1 : 0.8,
      glow: selected ? 1 : 0,
      shadow: selected ? 0.9 : 0.45,
      selected,
    };
  });
}

/** Media anchura y altura que la cámara debe encuadrar para que quepa todo. */
export function carouselBounds(count, narrow = false) {
  const targets = carouselTargets(count, 0, narrow);
  const widest = targets.reduce((max, t) => Math.max(max, Math.abs(t.x)), 0);
  const cardHalfWidth = 0.72;

  return {
    halfWidth: widest + cardHalfWidth + 0.25,
    halfHeight: 1.75 / 2 + 0.45,
  };
}
