import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ROUTES } from '../utils/constants';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-6xl font-bold text-cyan-300 mb-4">404</p>
      <h1 className="text-3xl font-bold text-white mb-4">
        Página no encontrada
      </h1>
      <p className="text-slate-300 mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <Link to={ROUTES.HOME}>
        <Button variant="light" size="lg">
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}
