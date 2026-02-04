import ProfileHeader from '../components/sections/ProfileHeader';
import EducationTimeline from '../components/sections/EducationTimeline';
import WorkExperience from '../components/sections/WorkExperience';
import CVDownload from '../components/sections/CVDownload';

export default function About() {
  return (
    <div>
      <ProfileHeader />
      <EducationTimeline />
      <WorkExperience />
      <CVDownload />
    </div>
  );
}