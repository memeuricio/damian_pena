/**
 * Genera las imágenes web (WebP + JPEG de respaldo) a partir de los originales.
 *
 * Uso:
 *   1. Coloca tus fotos originales en  assets/originals/
 *   2. Ejecuta:  pnpm images
 *
 * - Nunca lee de public/: siempre parte del original, así que puedes re-ejecutarlo
 *   cuantas veces quieras sin perder calidad.
 * - Nunca agranda una imagen (withoutEnlargement), solo la reduce si supera el ancho objetivo.
 *
 * Para agregar una foto nueva: déjala en assets/originals/ con el mismo nombre base
 * (por ejemplo "casa-los-andes.jpg"), añádela a IMAGES con su ancho y calidad, y ejecuta
 * pnpm images.
 */
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve("assets/originals");
const OUT_DIR = path.resolve("public");

/** Ancho objetivo y calidad por imagen. */
const IMAGES = [
  { name: "bg2",    width: 1920, quality: 72, note: "Fondo decorativo del hero (se ve al 20% de opacidad)" },
  { name: "p2",     width: 1600, quality: 78, note: "Proyecto: Bóvedas de Vino" },
  { name: "p1",     width: 1600, quality: 80, note: "Proyecto: Basílica de La Merced" },
  { name: "p3",     width: 1200, quality: 82, note: "Proyecto: Iglesia El Buen Pastor" },
  { name: "damian", width: 512,  quality: 82, note: "Foto de perfil" },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

/** Busca el original por nombre base, sea .jpg, .jpeg, .png o .webp. */
async function findSource(name, available) {
  const match = available.find(
    (file) => path.parse(file).name.toLowerCase() === name.toLowerCase() &&
      /\.(jpe?g|png|webp)$/i.test(file)
  );
  return match ? path.join(SRC_DIR, match) : null;
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`\n✗ No existe la carpeta de originales: ${SRC_DIR}`);
    console.error("  Créala y coloca ahí las fotos originales.\n");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const available = await readdir(SRC_DIR);

  let totalBefore = 0;
  let totalAfter = 0;
  const rows = [];

  for (const image of IMAGES) {
    const source = await findSource(image.name, available);

    if (!source) {
      rows.push({ name: image.name, status: "sin original", inKB: "-", outKB: "-", size: "-" });
      continue;
    }

    const before = (await stat(source)).size;
    const webpPath = path.join(OUT_DIR, `${image.name}.webp`);
    const jpgPath = path.join(OUT_DIR, `${image.name}.jpg`);

    // El WebP se comprime un poco más fuerte que el JPEG de respaldo: así siempre
    // sale más liviano, incluso en fotos con mucho detalle fino.
    const webpQuality = Math.max(40, Math.round(image.quality * 0.85));

    // El pipeline se construye una vez por formato para no releer el archivo.
    const base = () =>
      sharp(source, { failOn: "none" })
        .rotate() // respeta la orientación EXIF
        .resize({ width: image.width, withoutEnlargement: true });

    const [webpOut, jpgOut] = await Promise.all([
      base().webp({ quality: webpQuality, effort: 6 }).toFile(webpPath),
      base().jpeg({ quality: image.quality, mozjpeg: true, progressive: true }).toFile(jpgPath),
    ]);

    const after = (await stat(webpPath)).size + (await stat(jpgPath)).size;
    totalBefore += before;
    totalAfter += after;

    rows.push({
      name: image.name,
      status: "ok",
      inKB: kb(before),
      outKB: `${kb(webpOut.size)} webp + ${kb(jpgOut.size)} jpg`,
      size: `${webpOut.width}×${webpOut.height}`,
    });
  }

  // Resumen
  const nameW = Math.max(...rows.map((r) => r.name.length), 4);
  console.log("\n" + "Imagen".padEnd(nameW) + "  Original   Salida                        Dimensiones");
  console.log("-".repeat(nameW + 62));
  for (const r of rows) {
    console.log(
      r.name.padEnd(nameW) + "  " + r.inKB.padEnd(10) + " " + r.outKB.padEnd(30) + " " + r.size
    );
  }
  console.log("-".repeat(nameW + 62));
  console.log(
    `Total: ${(totalBefore / 1024 / 1024).toFixed(1)} MB  →  ${(totalAfter / 1024 / 1024).toFixed(2)} MB ` +
    `(${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}% menos)\n`
  );
}

main().catch((error) => {
  console.error("\n✗ Error optimizando imágenes:", error.message, "\n");
  process.exit(1);
});
