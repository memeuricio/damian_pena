import Hero from '../components/sections/Hero';
import PlanToBuilding from '../components/sections/PlanToBuilding';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import ServicesOverview from '../components/sections/ServicesOverview';

export default function Home() {
  return (
    <div>
      <Hero />
      <PlanToBuilding />
      <FeaturedProjects />
      <ServicesOverview />
    </div>
  );
}
