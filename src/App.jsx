import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constants';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Cada página se carga bajo demanda: la primera visita solo descarga la home.
const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex justify-center items-center py-32">
      <LoadingSpinner size="lg" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
            {/* Ruta con proyecto abierto: /portfolio/2 — antes no existía y los
                enlaces a proyectos desde la home terminaban en una página en blanco. */}
            <Route path={`${ROUTES.PORTFOLIO}/:projectId`} element={<Portfolio />} />
            <Route path={ROUTES.SERVICES} element={<Services />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
