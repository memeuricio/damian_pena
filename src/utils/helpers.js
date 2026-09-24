// Utility functions for the application

/** Devuelve la ruta del WebP equivalente a una imagen. Ver pnpm images. */
export const toWebp = (path) =>
  typeof path === "string" ? path.replace(/\.(jpe?g|png)$/i, ".webp") : path;

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(dateString));
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes: "Bóvedas" -> "bovedas"
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const getCategoryLabel = (category) => {
  const labels = {
    residential: 'Residencial',
    commercial: 'Comercial',
    industrial: 'Industrial',
    renovation: 'Remodelación',
    patrimonial: 'Patrimonial',
    design: 'Diseño',
    consultation: 'Consultoría',
    documentation: 'Documentación'
  };
  return labels[category] || category;
};
