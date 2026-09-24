/**
 * Geometría del carrusel de proyectos: un anillo visto en perspectiva.
 *
 * Vive aparte de la escena 3D a propósito: este módulo no importa three.js, así
 * que la sección puede usarlo (para saber cuánto hay que arrastrar por paso) sin
 * arrastrar el bundle de three a la carga inicial.
 */

/** Radio horizontal del anillo, en unidades. */
export const RADIUS = 4.2;

/**
 * Cuánto se comprime la profundidad del anillo. 1 sería un círculo perfecto.
 *
 * Un valor menor acerca las piezas traseras —que así no quedan tan pequeñas— sin
 * que el anillo deje de leerse: la cámara ya lo aplasta en perspectiva. Además,
 * con la profundidad comprimida el encuadre vertical es más ajustado y las piezas
 * se ven más grandes.
 */
const RING_SQUASH = 0.78;

/** Semiprofundidad del anillo. Es también el desplazamiento del grupo giratorio. */
export const RING_DEPTH = RADIUS * RING_SQUASH;

/** Elevación de la cámara sobre el plano del anillo (radianes, ~20°). */
export const CAMERA_ELEVATION = 0.35;

/**
 * Escala de la pieza que está al frente frente a las demás (125%).
 * El aspecto lo reparte la escena según cuán cerca esté cada pieza del frente.
 */
export const SELECTED_SCALE = 1;
export const OTHER_SCALE = 0.8;

/** Cuánto se eleva la pieza que está al frente. */
export const SELECTED_LIFT = 0.16;

/**
 * Atenuación de color de las piezas que no están al frente.
 * Es suave porque la separación por profundidad la hace la niebla de la escena;
 * oscurecerlas mucho además las ensuciaría.
 */
export const OTHER_TINT = 0.86;

/** Cuántos píxeles hay que arrastrar para avanzar una pieza. */
export const DRAG_PIXELS_PER_STEP = 110;

/** A partir de este movimiento se considera arrastre y no clic. */
export const DRAG_THRESHOLD = 6;

/** Una vuelta completa reparte las piezas por igual alrededor del anillo. */
export function carouselStep(count) {
  return count <= 1 ? 0 : (2 * Math.PI) / count;
}

/**
 * Posición de cada pieza relativa a la seleccionada.
 *
 * El desfase se envuelve alrededor de la circunferencia, así las piezas siempre
 * se reparten simétricamente a ambos lados de la seleccionada. Con 9 proyectos y
 * el índice 0 seleccionado, los desfases son 0, ±1, ±2, ±3 y ±4.
 */
export function carouselOffsets(count, selectedIndex) {
  return Array.from({ length: count }, (_, index) => {
    const wrapped = (((index - selectedIndex + count / 2) % count) + count) % count;
    return wrapped - count / 2;
  });
}

/**
 * Posición de cada pieza.
 *
 * Devuelve solo la geometría: el aspecto (escala, halo, atenuación, giro) lo
 * deduce la escena a partir de cuán cerca está cada pieza del frente, para que
 * durante el arrastre la que va llegando al centro crezca de forma continua.
 *
 * IMPORTANTE: x e z son coordenadas LOCALES al centro del anillo. La escena
 * coloca el grupo giratorio en (0, 0, -RING_DEPTH), así que la pieza seleccionada
 * queda en z = 0 y las demás repartidas alrededor.
 */
export function carouselTargets(count, selectedIndex) {
  const step = carouselStep(count);

  return carouselOffsets(count, selectedIndex).map((offset) => {
    const angle = offset * step;

    return {
      angle,
      x: RADIUS * Math.sin(angle),
      z: RING_DEPTH * Math.cos(angle),
      selected: offset === 0,
    };
  });
}

/**
 * Encuadre que la cámara necesita para que quepa todo.
 * `lookAtY` y `lookAtZ` apuntan al centro del anillo, no a la pieza del frente.
 */
export function carouselBounds(count) {
  const targets = carouselTargets(count, 0);
  const widest = targets.reduce((max, target) => Math.max(max, Math.abs(target.x)), 0);
  const deepest = targets.reduce((min, target) => Math.min(min, target.z), 0);

  return {
    halfWidth: widest + 0.55,
    // La profundidad del anillo se proyecta como altura al mirarlo inclinado.
    halfHeight: (Math.abs(deepest) * Math.sin(CAMERA_ELEVATION)) / 2 + 1.15,
    lookAtY: 0.28,
    lookAtZ: deepest / 2,
  };
}
