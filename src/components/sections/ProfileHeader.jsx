import { professionalProfile } from '../../data/mockData';
import OptimizedImage from '../common/OptimizedImage';
import ImagePlaceholder from '../common/ImagePlaceholder';

export default function ProfileHeader() {
  const { personalInfo } = professionalProfile;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Photo */}
          <div className="lg:col-span-1">
            <div className="aspect-square bg-white/5 ring-1 ring-white/10 rounded-2xl overflow-hidden mx-auto max-w-sm shadow-2xl">
              <OptimizedImage
                src={personalInfo.photo}
                alt={`${personalInfo.fullName} — ${personalInfo.title}`}
                className="w-full h-full object-cover"
                fallback={<ImagePlaceholder iconClassName="w-16 h-16" />}
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {personalInfo.fullName}
            </h1>
            <h2 className="text-xl sm:text-2xl text-cyan-300 font-medium mb-6">
              {personalInfo.title}
            </h2>
            
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              {personalInfo.summary}
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center lg:justify-start p-3 bg-white/5 ring-1 ring-white/10 rounded-lg">
                <svg className="w-5 h-5 text-cyan-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-200">{personalInfo.email}</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start p-3 bg-white/5 ring-1 ring-white/10 rounded-lg">
                <svg className="w-5 h-5 text-emerald-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-slate-200">{personalInfo.phone}</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start p-3 bg-white/5 ring-1 ring-white/10 rounded-lg sm:col-span-2">
                <svg className="w-5 h-5 text-cyan-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-200">{personalInfo.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}