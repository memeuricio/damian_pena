import { useState } from 'react';
import Button from '../common/Button';

/**
 * Cuando tengas el PDF real, guárdalo en public/ y pon aquí su ruta
 * (por ejemplo "/cv-damian-pena.pdf"). El botón pasa a ser una descarga real.
 */
const CV_URL = null;

export default function CVDownload() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-panel rounded-2xl p-8 text-center border border-black/10 shadow-lg">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            Descargar CV Completo
          </h2>
          
          <p className="text-primary-800 mb-6 max-w-2xl mx-auto">
            Obtén una versión completa de mi currículum vitae en formato PDF, 
            incluyendo toda mi experiencia, formación y competencias técnicas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {CV_URL ? (
              <a href={CV_URL} download>
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar CV (PDF)
                </Button>
              </a>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => setShowNotice(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar CV (PDF)
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.print()}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir Página
            </Button>
          </div>

          {/* Aviso en pantalla en vez del alert() de "por implementar" */}
          {showNotice && !CV_URL && (
            <p role="status" className="mt-6 text-sm text-primary-800 bg-surface-50 border border-surface-200 rounded-lg p-3">
              El PDF del currículum aún no está publicado. Puedes usar{" "}
              <strong>Imprimir Página</strong> para guardar esta información como PDF.
            </p>
          )}
          
          <div className="mt-6 text-sm text-primary-700">
            <p>Última actualización: Febrero 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
