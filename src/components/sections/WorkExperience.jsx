import { professionalProfile } from '../../data/mockData';

export default function WorkExperience() {
  const { experience, skills } = professionalProfile;

  return (
    <section className="py-16 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Experience */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-primary-900 mb-8">
              Experiencia Profesional
            </h2>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index !== experience.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-24 bg-surface-300"></div>
                  )}
                  
                  <div className="flex items-start space-x-6">
                    {/* Timeline dot */}
                    <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-lg border border-surface-200 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-primary-900 mb-1">
                            {exp.position}
                          </h3>
                          <p className="text-lg text-accent-600 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-primary-600 bg-surface-100 px-3 py-1 rounded-full mt-2 sm:mt-0">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      
                      <p className="text-primary-700 mb-4">
                        {exp.description}
                      </p>
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-primary-900 mb-2">
                            Logros destacados:
                          </h4>
                          <ul className="space-y-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="flex items-start text-sm text-primary-600">
                                <svg className="w-4 h-4 text-accent-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-primary-900 mb-8">
              Competencias Técnicas
            </h2>

            <div className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm">
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-primary-900 font-medium">
                        {skill.name}
                      </span>
                      <span className="text-sm text-primary-600">
                        {skill.level}
                      </span>
                    </div>
                    
                    <div className="w-full bg-surface-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          skill.level === 'Experto' ? 'bg-accent-600 w-full' :
                          skill.level === 'Avanzado' ? 'bg-accent-500 w-4/5' :
                          skill.level === 'Intermedio' ? 'bg-accent-400 w-3/5' :
                          'bg-accent-300 w-2/5'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-surface-200">
                <h4 className="font-semibold text-primary-900 mb-3">
                  Certificaciones
                </h4>
                <ul className="space-y-2 text-sm text-primary-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-accent-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Título Profesional en Dibujo Arquitectónico
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-accent-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Certificación AutoCAD
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}