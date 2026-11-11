import { Link, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { getProducto } from "../../services/productosService";
import { formatPrecio } from "../../utils/formato";
import Cargando from "../../components/Cargando";
import MensajeError from "../../components/MensajeError";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";

export default function DetalleProducto() {
  const { id } = useParams();
  const { data: producto, cargando, error } = useFetch(() => getProducto(Number(id)), [id]);
  const { agregarProducto } = useCart();
  const { tieneRol } = useAuth();

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} />;

  return (
  <>
    <Link to="/catalogo" className="small">← Volver al catálogo</Link>
    <div className="row g-4 mt-1">
      <div className="col-12 col-md-6">
        <img src={producto.imagenUrl} alt={producto.nombre} className="img-fluid rounded" />
      </div>
      <div className="col-12 col-md-6">
        <small className="text-muted">{producto.marca} {producto.modelo} · {producto.categoria}</small>
        <h1 className="mt-1">{producto.nombre}</h1>
        <p className="h4">{formatPrecio(producto.precio)}</p>
        <p>{producto.descripcion}</p>
        <p className={producto.stock > 0 ? "text-success" : "text-danger"}>
          {producto.stock > 0 ? `${producto.stock} unidades disponibles` : "Sin stock"}
        </p>

        {/* solo los clientes pueden comprar */}
        {tieneRol(ROLES.CLIENTE) && (
          <button
            className="btn btn-primario"
            disabled={producto.stock === 0}
            onClick={() => agregarProducto(producto)}
          >
            Agregar al carrito
          </button>
        )}
      </div>
    </div>
  </>
);
}