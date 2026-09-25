/**
 * Cabecera de página.
 *
 * Va directamente sobre el espacio modelo, así que el texto es claro: no hay
 * tarjeta que lo respalde.
 */
export default function Header({ title, subtitle, className = '' }) {
  return (
    <header className={`py-16 sm:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-slate-300">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
