import { useState } from 'react';
import Button from '../common/Button';
import { PROJECT_CATEGORIES } from '../../utils/constants';
import { getCategoryLabel } from '../../utils/helpers';

export default function ContactForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'El tipo de proyecto es requerido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSubmit) {
        onSubmit(formData);
      } else {
        alert('Formulario enviado correctamente. Te contactaré pronto.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          message: ''
        });
      }
    } catch (error) {
      alert('Error al enviar el formulario. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { value: '', label: 'Selecciona el tipo de proyecto' },
    ...Object.values(PROJECT_CATEGORIES).map(category => ({
      value: category,
      label: getCategoryLabel(category)
    })),
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-sky-50 rounded-2xl shadow-sm border border-surface-200 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary-900 mb-2">
          Envíame un mensaje
        </h2>
        <p className="text-primary-600">
          Cuéntame sobre tu proyecto y te contactaré en menos de 24 horas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary-900 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
              errors.name 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="Tu nombre completo"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
              errors.email 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary-900 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
              errors.phone 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="+56 9 1234 5678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-primary-900 mb-2">
            Tipo de proyecto *
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
              errors.projectType 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
          >
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <p className="mt-1 text-sm text-red-600">{errors.projectType}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-primary-900 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors resize-vertical ${
              errors.message 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="Cuéntame sobre tu proyecto: ubicación, área aproximada, presupuesto, fechas importantes, etc."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          <p className="mt-1 text-sm text-primary-500">
            {formData.message.length}/500 caracteres
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>

        <p className="text-xs text-primary-500 text-center">
          * Campos requeridos. Tu información será tratada de forma confidencial.
        </p>
      </form>
    </div>
  );
}