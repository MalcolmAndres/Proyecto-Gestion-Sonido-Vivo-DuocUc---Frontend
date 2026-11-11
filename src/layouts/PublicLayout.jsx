import { Outlet,Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="d-flex align-items-center justify-content-center px-3"
      style={{ minHeight: "100vh", background: "var(--sv-oscuro)" }}>
      <div className="card shadow-sm w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4">
          <h1 className="brand text-center mb-4">Sonido Vivo</h1>
          <Outlet />
          <p className="text-center mt-3 mb-0 small"><Link to="/">← Volver al inicio</Link></p>
        </div>
      </div>
    </div>
  );
}
