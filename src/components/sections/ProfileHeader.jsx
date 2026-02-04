import { professionalProfile } from '../../data/mockData';

export default function ProfileHeader() {
  const { personalInfo } = professionalProfile;

  return (
    <section className="py-16 bg-gradient-to-br from-sky-50 via-surface-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Photo */}
          <div className="lg:col-span-1">
            <div className="aspect-square bg-gradient-to-br from-sky-100 via-accent-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto max-w-sm">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-primary-600 text-sm">
                  Foto profesional
                  <br />
                  (por agregar)
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 mb-2">
              {personalInfo.fullName}
            </h1>
            <h2 className="text-xl sm:text-2xl text-accent-600 font-medium mb-6">
              {personalInfo.title}
            </h2>
            
            <p className="text-lg text-primary-700 leading-relaxed mb-8">
              {personalInfo.summary}
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center lg:justify-start p-3 bg-sky-50 rounded-lg">
                <svg className="w-5 h-5 text-sky-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-primary-700">{personalInfo.email}</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start p-3 bg-emerald-50 rounded-lg">
                <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-primary-700">{personalInfo.phone}</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start p-3 bg-accent-50 rounded-lg sm:col-span-2">
                <svg className="w-5 h-5 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-primary-700">{personalInfo.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}