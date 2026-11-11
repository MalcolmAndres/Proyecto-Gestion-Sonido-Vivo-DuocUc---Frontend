import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { actualizarStock, getProductos } from "../../services/productosService";
import { formatPrecio } from "../../utils/formato";
import Cargando from "../../components/Cargando";
import MensajeError from "../../components/MensajeError";

export default function GestionStock() {
  const { data: productos, cargando, error, setData } = useFetch(() => getProductos(), []);
  const [editados, setEditados] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [errorGuardar, setErrorGuardar] = useState(null);

  const cambiar = (id, valor) => setEditados({ ...editados, [id]: valor });

  const guardar = async (producto) => {
    setErrorGuardar(null);
    try {
      const actualizado = await actualizarStock(producto.id, Number(editados[producto.id]));
      setData(productos.map((p) => (p.id === producto.id ? actualizado : p)));
      const { [producto.id]: _, ...resto } = editados;
      setEditados(resto);
    } catch (err) {
      setErrorGuardar(err.message);
    }
  };

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} />;

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <h1>Stock de productos</h1>
      <MensajeError mensaje={errorGuardar} />
      <input className="form-control mb-3" placeholder="Buscar producto..."
        value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      <div className="table-responsive">
        <table className="table align-middle bg-white">
          <thead>
            <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th style={{ width: 120 }}>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id} className={p.stock === 0 ? "table-danger" : p.stock <= 2 ? "table-warning" : ""}>
                <td>{p.nombre}</td>
                <td className="small">{p.categoria}</td>
                <td className="text-nowrap">{formatPrecio(p.precio)}</td>
                <td>
                  <input type="number" min="0" className="form-control form-control-sm"
                    value={editados[p.id] ?? p.stock}
                    onChange={(e) => cambiar(p.id, e.target.value)} />
                </td>
                <td>
                  {editados[p.id] !== undefined && (
                    <button className="btn btn-sm btn-primario" onClick={() => guardar(p)}>Guardar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small text-muted">Rojo: sin stock · Amarillo: 2 unidades o menos</p>
    </>
  );
}