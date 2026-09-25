/**
 * Geometría del carrusel de proyectos: un anillo visto en perspectiva.
 *
 * La configuración va en presets por tipo de pantalla: los mismos números no
 * funcionan en un contenedor apaisado de 305 px y en uno de móvil de 215 px
 * (con el preset de escritorio, en móvil la cámara queda tan lejos que las
 * maquetas se ven a un tercio de tamaño). La escena elige el preset según el
 * ancho del lienzo y se lo pasa a `carouselTargets` y `carouselBounds`.
 *
 * Vive aparte de la escena 3D a propósito: este módulo no importa three.js, así
 * que la sección puede usarlo (para saber cuánto hay que arrastrar por paso) sin
 * arrastrar el bundle de three a la carga inicial.
 */

/** Ancho de lienzo (px) a partir del cual se usa el preset de escritorio. */
export const DESKTOP_MIN_WIDTH = 768;

/**
 * Constantes de encuadre. Todas se pueden ajustar por separado en cada preset:
 *
 * - `radius`: radio del anillo, en unidades. El anillo es circular (sin
 *   achatamiento: acercaba las piezas traseras pero deformaba el arrastre).
 *   Cuanto menor, más se acerca la cámara y más grandes se ven las maquetas.
 * - `cameraElevation`: elevación de la cámara sobre el plano del anillo, en
 *   radianes. Baja = anillo casi de frente; alta = elipse vista desde arriba.
 * - `halfWidthPadding`: aire horizontal extra alrededor del anillo. Súbelo si
 *   las piezas de los costados quedan cortadas.
 * - `selectedScale` / `otherScale`: tamaño de la pieza del frente y del resto.
 * - `selectedLift`: cuánto se eleva la pieza del frente.
 * - `otherTint`: atenuación de color de las piezas que no están al frente.
 */
export const CAROUSEL_LAYOUTS = {
  /**
   * Móvil: contenedor estrecho y bajo (215 px). Radio corto para que la cámara
   * pueda acercarse de verdad, y elevación media para que el anillo se lea en
   * vertical en pantallas altas y angostas.
   */
  mobile: {
    radius: 2.5,
    cameraElevation: 0.08,
    halfWidthPadding: 0.4,
    selectedScale: 1,
    otherScale: 0.8,
    selectedLift: 0.16,
    otherTint: 0.86,
  },
  /**
   * Escritorio: contenedor apaisado (305 px). Cámara muy baja para que el anillo
   * se lea casi de frente y la pieza del frente no tape a las de atrás.
   */
  desktop: {
    radius: 5.2,
    cameraElevation: 0.045,
    halfWidthPadding: 1.5,
    selectedScale: 1,
    otherScale: 0.8,
    selectedLift: 0.16,
    otherTint: 0.86,
  },
};

/** Preset que corresponde a un ancho de lienzo, en píxeles. */
export function carouselLayoutFor(width) {
  return width >= DESKTOP_MIN_WIDTH ? CAROUSEL_LAYOUTS.desktop : CAROUSEL_LAYOUTS.mobile;
}

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
 * coloca el grupo giratorio en (0, 0, -radius), así que la pieza seleccionada
 * queda en z = 0 y las demás repartidas alrededor.
 */
export function carouselTargets(count, selectedIndex, layout = CAROUSEL_LAYOUTS.desktop) {
  const step = carouselStep(count);

  return carouselOffsets(count, selectedIndex).map((offset) => {
    const angle = offset * step;

    return {
      angle,
      x: layout.radius * Math.sin(angle),
      z: layout.radius * Math.cos(angle),
      selected: offset === 0,
    };
  });
}

/**
 * Encuadre que la cámara necesita para que quepa todo.
 * `lookAtY` y `lookAtZ` apuntan al centro del anillo, no a la pieza del frente.
 */
export function carouselBounds(count, layout = CAROUSEL_LAYOUTS.desktop) {
  const targets = carouselTargets(count, 0, layout);
  const widest = targets.reduce((max, target) => Math.max(max, Math.abs(target.x)), 0);
  const deepest = targets.reduce((min, target) => Math.min(min, target.z), 0);

  return {
    halfWidth: widest + layout.halfWidthPadding,
    // La profundidad del anillo se proyecta como altura al mirarlo inclinado.
    halfHeight: (Math.abs(deepest) * Math.sin(layout.cameraElevation)) / 2 + 1.15,
    lookAtY: 0.28,
    lookAtZ: deepest / 2,
  };
}
