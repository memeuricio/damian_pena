/**
 * Barra de búsqueda controlada.
 *
 * El estado vive en el componente padre (ProjectGrid) para que la búsqueda sea
 * en vivo ("value"/"onChange"). Antes tenía estado propio y eso provocaba que al
 * limpiar los filtros el texto siguiera escrito en el input.
 */
export default function SearchBar({ value, onChange, placeholder = "Buscar proyectos..." }) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="relative max-w-md mx-auto"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Buscar proyectos"
          className="block w-full pl-10 pr-10 py-3 border border-surface-300 rounded-lg leading-5 bg-white placeholder-primary-400 text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          placeholder={placeholder}
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Limpiar búsqueda"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-400 hover:text-primary-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
