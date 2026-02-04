import Hero from '../components/sections/Hero';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import ServicesOverview from '../components/sections/ServicesOverview';

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProjects />
      <ServicesOverview />
    </div>
  );
}