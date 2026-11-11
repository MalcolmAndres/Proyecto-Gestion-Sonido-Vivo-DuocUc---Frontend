import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/roles";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getCategorias, getProductos } from "../../services/productosService";
import ProductCard from "../../components/ProductCard";
import Cargando from "../../components/Cargando";
import MensajeError from "../../components/MensajeError";

export default function Catalogo() {
  const { agregarProducto } = useCart();
  const { tieneRol } = useAuth();
  const [categoria, setCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const { data: productos, cargando, error } = useFetch(
    () => getProductos({ categoria, busqueda }),
    [categoria, busqueda]
  );
  const { data: categorias } = useFetch(getCategorias, []);

  return (
    <>
      <h1>Catálogo</h1>

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <input className="form-control" placeholder="Buscar por nombre o marca..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <MensajeError mensaje={error} />

      {cargando && !productos ? (
        <Cargando texto="Cargando productos..." />
      ) : (
        <div className="row g-3">
          {productos?.length === 0 && <p className="text-muted">No hay productos que coincidan.</p>}
          {productos?.map((p) => (
            <div className="col-12 col-sm-6 col-lg-3" key={p.id}>
              <ProductCard
                producto={p}
                onAgregar={tieneRol(ROLES.CLIENTE) ? agregarProducto : null}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}