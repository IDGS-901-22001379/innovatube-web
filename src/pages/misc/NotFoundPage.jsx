import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4">404</h1>
      <p className="lead">Página no encontrada</p>
      <Link to="/" className="btn btn-primary">
        Ir al inicio
      </Link>
    </div>
  );
}
