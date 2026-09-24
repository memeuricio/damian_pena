/**
 * Marcador de posición para cuando una imagen no carga.
 * Reemplaza los bloques de SVG que estaban duplicados en 4 componentes.
 */
export default function ImagePlaceholder({ iconClassName = "w-16 h-16" }) {
  return (
    <div className="w-full h-full bg-surface-200 flex items-center justify-center">
      <svg
        className={`${iconClassName} text-surface-400`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}
