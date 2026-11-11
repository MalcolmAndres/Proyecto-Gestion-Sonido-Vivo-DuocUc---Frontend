import { Link } from "react-router-dom";
import { formatPrecio } from "../utils/formato";

export default function ProductCard({ producto, onAgregar }) {
  const sinStock = producto.stock === 0;

  return (
    <div className="card h-100 shadow-sm">
      <img src={producto.imagenUrl} className="card-img-top" alt={producto.nombre} />
      <div className="card-body d-flex flex-column">
        <small className="text-muted">{producto.marca} · {producto.categoria}</small>
        <h2 className="h6 mt-1">
          <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
        </h2>
        <p className="fw-bold mb-1">{formatPrecio(producto.precio)}</p>
        <p className={`small mb-3 ${sinStock ? "text-danger" : "text-success"}`}>
          {sinStock ? "Sin stock" : `${producto.stock} disponibles`}
        </p>
        {onAgregar && (
          <button className="btn btn-primario btn-sm mt-auto" disabled={sinStock} onClick={() => onAgregar(producto)}>
            Agregar al carrito
          </button>
        )}
      </div>
    </div>
  );
}