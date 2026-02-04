export default function Header({ 
  title, 
  subtitle, 
  backgroundImage, 
  overlay = false,
  className = '' 
}) {
  const headerStyle = backgroundImage 
    ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
    <header 
      className={`relative py-16 sm:py-24 ${className}`}
      style={headerStyle}
    >
      {/* Overlay */}
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${
            backgroundImage && overlay 
              ? 'text-white' 
              : 'text-primary-900'
          }`}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
              backgroundImage && overlay 
                ? 'text-gray-200' 
                : 'text-primary-600'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}