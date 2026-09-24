/**
 * Cabecera de página.
 *
 * Se eliminaron los props `backgroundImage` y `overlay`, que no se usaban desde
 * ningún sitio y contenían clases de opacidad de Tailwind v3 (bg-opacity-40) que
 * en v4 ya no existen.
 */
export default function Header({ title, subtitle, className = '' }) {
  return (
    <header className={`py-16 sm:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-primary-900">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-primary-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
