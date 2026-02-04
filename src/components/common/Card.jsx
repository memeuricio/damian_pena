export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'default',
  onClick 
}) {
  const baseClasses = 'bg-white rounded-lg border border-surface-200 shadow-sm';
  
  const hoverClasses = hover 
    ? 'hover:shadow-md hover:border-surface-300 transition-all duration-200 cursor-pointer' 
    : '';
    
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };
  
  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;
  
  const CardComponent = onClick ? 'button' : 'div';
  
  return (
    <CardComponent 
      className={classes}
      onClick={onClick}
    >
      {children}
    </CardComponent>
  );
}