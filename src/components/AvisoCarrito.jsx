import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

// Aviso emergente (abajo a la derecha) cuando se agrega algo al carrito.
// Se cierra solo a los 3 segundos o con la X.
export default function AvisoCarrito() {
  const { aviso, cerrarAviso } = useCart();

  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(cerrarAviso, 3000);
    return () => clearTimeout(timer); // si llega otro aviso, reinicia el contador
  }, [aviso]);

  if (!aviso) return null;

  const esError = aviso.tipo === "error";

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1080, maxWidth: "100%" }}
    >
      <div
        className={`toast show align-items-center border-0 text-white ${esError ? "bg-danger" : "bg-success"}`}
        role="status"
        aria-live="polite"
      >
        <div className="d-flex">
          <div className="toast-body">
            {aviso.texto}
            {!esError && (
              <div className="mt-1">
                <Link to="/carrito" className="text-white fw-bold" onClick={cerrarAviso}>
                  Ver carrito →
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Cerrar"
            onClick={cerrarAviso}
          />
        </div>
      </div>
    </div>
  );
}
