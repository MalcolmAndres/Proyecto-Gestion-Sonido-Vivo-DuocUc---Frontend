import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { INICIO_POR_ROL } from "../utils/roles";

const CATEGORIAS = ["Guitarras", "Bajos", "Baterías", "Teclados", "Amplificadores", "Micrófonos", "Pedales", "Accesorios"];

export default function Home() {
  const { usuario } = useAuth();

  return (
    <>
      <header className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand brand">Sonido Vivo</span>
          <div className="d-flex gap-2">
            {usuario ? (
              <Link className="btn btn-primario btn-sm" to={INICIO_POR_ROL[usuario.rol]}>Ir a mi cuenta</Link>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Iniciar sesión</Link>
                <Link className="btn btn-primario btn-sm" to="/registro">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="py-5 text-center text-white" style={{ background: "var(--sv-oscuro)" }}>
        <div className="container py-4">
          <h1 className="display-5 fw-bold">Instrumentos y equipos para músicos</h1>
          <p className="lead mb-4">
            Más de 11 años en Viña del Mar. Ahora puedes ver el catálogo, comprar en línea
            y elegir despacho o retiro en tienda.
          </p>
          <Link className="btn btn-primario btn-lg" to={usuario ? "/catalogo" : "/registro"}>
            {usuario ? "Ver catálogo" : "Crear mi cuenta"}
          </Link>
        </div>
      </section>

      <main className="container py-5">
        <h2 className="h4 text-center mb-4">¿Qué encuentras en Sonido Vivo?</h2>
        <div className="row g-2 justify-content-center mb-5">
          {CATEGORIAS.map((c) => (
            <div className="col-6 col-md-3" key={c}>
              <div className="card text-center h-100">
                <div className="card-body fw-semibold">{c}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <h3 className="h5">Catálogo actualizado</h3>
            <p className="text-muted">Precios y stock al día, sin preguntar por WhatsApp.</p>
          </div>
          <div className="col-12 col-md-4">
            <h3 className="h5">Despacho o retiro</h3>
            <p className="text-muted">Recibe en tu casa o retira en la tienda o en un punto de retiro.</p>
          </div>
          <div className="col-12 col-md-4">
            <h3 className="h5">Sigue tu pedido</h3>
            <p className="text-muted">Revisa el estado y el número de seguimiento desde tu cuenta.</p>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white-50 py-3 text-center small">
        Sonido Vivo · Viña del Mar, Región de Valparaíso
      </footer>
    </>
  );
}