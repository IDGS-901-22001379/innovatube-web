import { Navigate, useLocation } from "react-router-dom";
import { sessionStore } from "../services/http";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const session = sessionStore.get();

  // Aquí solo checamos que exista una sesión (puedes ajustar a tu gusto)
  if (!session || !session.accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
