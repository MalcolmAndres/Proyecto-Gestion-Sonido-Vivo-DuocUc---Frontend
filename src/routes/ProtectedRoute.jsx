// Persona 1 — bloquea rutas sin sesión o sin el rol requerido.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ roles }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/no-autorizado" replace />;
  return <Outlet />;
}
