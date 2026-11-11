import { Link } from "react-router-dom";

export default function NoAutorizado() {
  return (
    <div className="text-center py-5">
      <h1 className="h3">No tienes permiso para ver esta página</h1>
      <Link to="/" className="btn btn-dark mt-3">Volver al inicio</Link>
    </div>
  );
}
