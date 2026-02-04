import Header from '../components/layout/Header';
import ContactForm from '../components/sections/ContactForm';
import ContactInfo from '../components/sections/ContactInfo';

export default function Contact() {
  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
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