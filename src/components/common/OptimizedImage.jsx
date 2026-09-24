/**
 * Imagen con formato moderno WebP y respaldo automático.
 *
 * Genera un <picture> con el WebP como primera opción y el archivo original
 * (ya optimizado) como respaldo para navegadores antiguos.
 *
 * Usa `display: contents` en el <picture> para que el <img> siga siendo el que
 * participa en el layout: así conserva intactas clases como object-cover, h-full
 * o group-hover:scale-105.
 *
 * Si la imagen falla, renderiza `fallback` (ver ImagePlaceholder).
 *
 * Las versiones WebP se generan con: pnpm images
 */
import { useState } from "react";
import { toWebp } from "../../utils/helpers";

export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  fallback = null,
  ...props
}) {
  const [failed, setFailed] = useState(false);
  const webp = toWebp(src);

  if (failed) return fallback;

  return (
    <picture className="contents">
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onError={() => setFailed(true)}
        {...props}
      />
    </picture>
  );
}
