import { useState } from 'react';
import Button from '../common/Button';
import { PROJECT_CATEGORIES } from '../../utils/constants';
import { getCategoryLabel } from '../../utils/helpers';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: ''
};

const MAX_MESSAGE_LENGTH = 500;

export default function ContactForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // El envío real lo define el padre (ver pages/Contact.jsx).
      await onSubmit?.(formData);
      setFormData(EMPTY_FORM);
      setErrors({});
      setIsSubmitted(true);
    } catch {
      setSubmitError('No se pudo enviar el mensaje. Intenta nuevamente o escríbeme directo por email.');
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

  // Confirmación en pantalla. Antes el formulario enviaba, pasaban 2 segundos
  // y no aparecía ninguna señal de que algo había ocurrido.
  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 via-white to-sky-50 rounded-2xl shadow-sm border border-surface-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-primary-900 mb-2">¡Mensaje enviado!</h2>
        <p role="status" className="text-primary-600 mb-6">
          Gracias por escribirme. Te responderé dentro de las próximas 24 horas.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

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

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
            aria-invalid={Boolean(errors.name)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
              errors.name 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="Tu nombre completo"
          />
          {errors.name && (
            <p role="alert" className="mt-1 text-sm text-red-600">{errors.name}</p>
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
            aria-invalid={Boolean(errors.email)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
              errors.email 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-sm text-red-600">{errors.email}</p>
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
            aria-invalid={Boolean(errors.phone)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
              errors.phone 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="+56 9 1234 5678"
          />
          {errors.phone && (
            <p role="alert" className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
            aria-invalid={Boolean(errors.projectType)}
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
            <p role="alert" className="mt-1 text-sm text-red-600">{errors.projectType}</p>
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
            maxLength={MAX_MESSAGE_LENGTH}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors resize-y ${
              errors.message 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-surface-300 focus:border-accent-500'
            }`}
            placeholder="Cuéntame sobre tu proyecto: ubicación, área aproximada, presupuesto, fechas importantes, etc."
          />
          {errors.message && (
            <p role="alert" className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          <p className="mt-1 text-sm text-primary-500">
            {formData.message.length}/{MAX_MESSAGE_LENGTH} caracteres
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

        {submitError && (
          <p role="alert" className="text-sm text-red-600 text-center">{submitError}</p>
        )}

        <p className="text-xs text-primary-500 text-center">
          * Campos requeridos. Tu información será tratada de forma confidencial.
        </p>
      </form>
    </div>
  );
}
