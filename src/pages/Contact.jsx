import Header from '../components/layout/Header';
import ContactForm from '../components/sections/ContactForm';
import ContactInfo from '../components/sections/ContactInfo';

export default function Contact() {
  /**
   * Punto de integración del formulario.
   *
   * Ahora mismo solo simula la espera: no envía nada a ningún lado. Para que
   * llegue de verdad, reemplaza el setTimeout por una llamada real. Opciones sin
   * backend propio: Formspree, Web3Forms, EmailJS o Netlify Forms.
   *
   * Si la promesa se rechaza, el formulario muestra el mensaje de error.
   */
  const handleFormSubmit = async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Formulario listo para enviar:', formData);
  };

  return (
    <div>
      <Header 
        title="Contacto"
        subtitle="Hablemos sobre tu próximo proyecto arquitectónico"
        className="bg-surface-50"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm onSubmit={handleFormSubmit} />
          </div>
          
          {/* Contact Info */}
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
