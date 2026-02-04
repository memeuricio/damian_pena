// Utility functions for the application

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
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
};

export const getCategoryLabel = (category) => {
  const labels = {
    residential: 'Residencial',
    commercial: 'Comercial',
    industrial: 'Industrial',
    renovation: 'Remodelación',
    design: 'Diseño',
    consultation: 'Consultoría',
    documentation: 'Documentación'
  };
  return labels[category] || category;
};