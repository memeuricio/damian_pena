/**
 * Iconos genéricos de proyecto y las texturas de las tarjetas del carrusel.
 *
 * Los iconos son provisionales: se dibujan por categoría con primitivas de
 * canvas (rectángulos, triángulos y líneas), así no hace falta ningún archivo
 * ni dependencia extra. Cuando cada proyecto tenga su propio icono, basta con
 * sustituir `drawCategoryIcon` por la imagen correspondiente.
 */

const ACCENT = '#2563eb';
const INK = '#0f172a';

/* ------------------------------------------------------------------ iconos */

const box = (ctx, x, y, w, h) => ctx.strokeRect(x, y, w, h);
const filled = (ctx, x, y, w, h) => ctx.fillRect(x, y, w, h);

/**
 * Dibuja el icono de una categoría dentro de una caja de 100x100 centrada en el
 * origen. El llamador se encarga de trasladar y escalar.
 */
function drawCategoryIcon(ctx, category) {
  ctx.save();
  ctx.translate(-50, -50); // el origen pasa a ser la esquina de la caja 0..100

  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = ACCENT;
  ctx.fillStyle = ACCENT;

  switch (category) {
    // Edificio de oficinas: volumen con ventanas y línea de suelo
    case 'commercial': {
      box(ctx, 26, 16, 48, 70);
      for (const y of [30, 48, 66]) {
        filled(ctx, 37, y - 6, 12, 12);
        filled(ctx, 57, y - 6, 12, 12);
      }
      ctx.beginPath();
      ctx.moveTo(14, 88);
      ctx.lineTo(86, 88);
      ctx.stroke();
      break;
    }

    // Templo clásico: frontón, columnas y base
    case 'patrimonial': {
      ctx.beginPath();
      ctx.moveTo(16, 42);
      ctx.lineTo(50, 16);
      ctx.lineTo(84, 42);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(20, 48);
      ctx.lineTo(80, 48);
      ctx.stroke();

      for (const x of [24, 40, 56, 72]) {
        filled(ctx, x, 54, 7, 28);
      }

      filled(ctx, 18, 84, 64, 7);
      break;
    }

    // Casa: techo a dos aguas, muros, puerta y ventanas
    case 'residential': {
      ctx.beginPath();
      ctx.moveTo(14, 48);
      ctx.lineTo(50, 18);
      ctx.lineTo(86, 48);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(22, 44);
      ctx.lineTo(22, 86);
      ctx.lineTo(78, 86);
      ctx.lineTo(78, 44);
      ctx.stroke();

      box(ctx, 42, 62, 16, 24);
      box(ctx, 28, 56, 10, 10);
      box(ctx, 62, 56, 10, 10);
      break;
    }

    // Fábrica: chimenea, nave y ventanas
    case 'industrial': {
      box(ctx, 64, 16, 12, 32);
      box(ctx, 18, 46, 64, 42);
      filled(ctx, 26, 56, 12, 12);
      filled(ctx, 46, 56, 12, 12);
      filled(ctx, 66, 56, 12, 12);
      box(ctx, 42, 70, 16, 18);
      break;
    }

    // Remodelación: martillo
    case 'renovation': {
      filled(ctx, 24, 22, 44, 14);
      filled(ctx, 44, 36, 12, 48);
      break;
    }

    // Por defecto: cubo isométrico
    default: {
      const top = [50, 16, 84, 34, 50, 52, 16, 34];
      const left = [16, 34, 50, 52, 50, 86, 16, 68];
      const right = [84, 34, 50, 52, 50, 86, 84, 68];

      for (const shape of [top, left, right]) {
        ctx.beginPath();
        ctx.moveTo(shape[0], shape[1]);
        for (let i = 2; i < shape.length; i += 2) {
          ctx.lineTo(shape[i], shape[i + 1]);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

/* ----------------------------------------------------- placa del título */
export const PLAQUE_WIDTH = 1.02;
export const PLAQUE_HEIGHT = (PLAQUE_WIDTH * 120) / 512;

/**
 * Lienzo de la placa con el título que va debajo de cada maqueta.
 *
 * La placa es baja a propósito (512x120): así el texto ocupa una fracción mayor
 * de su altura y sigue siendo legible cuando hay muchas piezas en el carrusel.
 * El tamaño de letra se ajusta solo para que quepa, y si aun así no cabe, recorta.
 */
export function createPlaqueCanvas(project) {
  const W = 512;
  const H = 120;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Placa (con margen interior para que las placas vecinas no se toquen)
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 22, 10, W - 44, H - 20, 22);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Título, ajustado al ancho disponible
  const available = W - 84;
  let fontSize = 46;
  let text = project.title;
  ctx.font = `600 ${fontSize}px Inter, "Segoe UI", system-ui, sans-serif`;

  while (ctx.measureText(text).width > available && fontSize > 20) {
    fontSize -= 2;
    ctx.font = `600 ${fontSize}px Inter, "Segoe UI", system-ui, sans-serif`;
  }

  while (ctx.measureText(text).width > available && text.length > 4) {
    text = `${text.slice(0, -2)}…`;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = INK;
  ctx.fillText(text, W / 2, H / 2 + 2);

  return canvas;
}

/* --------------------------------------------------------------- utilidades */

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

/** Parte un texto en líneas que quepan en `maxWidth`. */
function wrapText(ctx, text, maxWidth, maxLines) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }

  if (lines.length < maxLines && current) lines.push(current);

  // Si se pasó de líneas, la última termina en puntos suspensivos
  if (lines.length === maxLines) {
    const joined = lines.join(' ');
    if (joined.length < text.length) {
      let last = lines[maxLines - 1];
      while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = `${last}…`;
    }
  }

  return lines;
}

/* ------------------------------------------------------- respaldo sin WebGL */

/**
 * Tarjeta con el icono de la categoría. Solo se usa como respaldo cuando el
 * navegador no puede dibujar WebGL.
 */
export const CARD_WIDTH = 1.4;
export const CARD_HEIGHT = 1.75;

/** Genera el lienzo de una tarjeta de proyecto (512x640). */
export function createCardCanvas(project) {
  const W = 512;
  const H = 640;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Placa
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 18, 18, W - 36, H - 36, 34);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Icono
  ctx.save();
  ctx.translate(W / 2, 232);
  ctx.scale(1.9, 1.9);
  drawCategoryIcon(ctx, project.category);
  ctx.restore();

  // Separador
  ctx.beginPath();
  ctx.moveTo(120, 378);
  ctx.lineTo(W - 120, 378);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Título
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  ctx.font = '600 38px Inter, "Segoe UI", system-ui, sans-serif';

  const lines = wrapText(ctx, project.title, W - 120, 2);
  const firstLineY = lines.length === 2 ? 428 : 452;
  lines.forEach((line, index) => {
    ctx.fillText(line, W / 2, firstLineY + index * 46);
  });

  // Categoría
  ctx.fillStyle = ACCENT;
  ctx.font = '600 24px Inter, "Segoe UI", system-ui, sans-serif';
  const category = (project.category ?? '').toUpperCase();
  if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
  ctx.fillText(category, W / 2, 548);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  // Año
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 26px Inter, "Segoe UI", system-ui, sans-serif';
  ctx.fillText(String(project.specifications?.year ?? ''), W / 2, 592);

  return canvas;
}

/** Halo azul que se coloca detrás de la maqueta seleccionada. */
export const GLOW_STOPS = [
  [0, 'rgba(37, 99, 235, 0.42)'],
  [0.45, 'rgba(37, 99, 235, 0.16)'],
  [1, 'rgba(37, 99, 235, 0)'],
];

/** Sombra suave que da profundidad bajo cada tarjeta. */
export const SHADOW_STOPS = [
  [0, 'rgba(15, 23, 42, 0.28)'],
  [0.5, 'rgba(15, 23, 42, 0.10)'],
  [1, 'rgba(15, 23, 42, 0)'],
];

/** Lienzo con un degradado radial, para halos y sombras. */
export function createRadialCanvas(stops, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return canvas;
}
