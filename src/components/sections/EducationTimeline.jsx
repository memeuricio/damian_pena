import { professionalProfile } from '../../data/mockData';

export default function EducationTimeline() {
  const { education } = professionalProfile;

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-surface-50 to-sky-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">
          Formación Académica
        </h2>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index !== education.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-surface-300"></div>
              )}
              
              <div className="flex items-start space-x-6">
                {/* Timeline dot */}
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg border border-surface-200 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h3 className="text-xl font-semibold text-primary-900">
                      {edu.degree}
                    </h3>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                  
                  <p className="text-lg text-primary-700 mb-2">
                    {edu.field}
                  </p>
                  
                  <p className="text-primary-600 mb-4">
                    {edu.institution}
                  </p>
                  
                  {edu.description && (
                    <p className="text-primary-600 text-sm">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}