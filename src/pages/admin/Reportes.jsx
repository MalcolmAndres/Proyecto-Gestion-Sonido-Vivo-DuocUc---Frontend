import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getReporteVentas } from "../../services/reportesService";
import { formatFecha, formatPrecio } from "../../utils/formato";
import Cargando from "../../components/Cargando";
import MensajeError from "../../components/MensajeError";

const hoy = new Date().toISOString().slice(0, 10);
const haceUnMes = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function Reportes() {
  const [desde, setDesde] = useState(haceUnMes);
  const [hasta, setHasta] = useState(hoy);
  const { data: reporte, cargando, error } = useFetch(
    () => getReporteVentas({ desde, hasta }),
    [desde, hasta]
  );

  return (
    <>
      <h1>Reporte de ventas</h1>
      <div className="row g-2 mb-4">
        <div className="col-6 col-md-3">
          <label className="form-label small" htmlFor="desde">Desde</label>
          <input id="desde" type="date" className="form-control" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label small" htmlFor="hasta">Hasta</label>
          <input id="hasta" type="date" className="form-control" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
      </div>
      <MensajeError mensaje={error} />
      {cargando ? <Cargando /> : reporte && (
  <>
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-6">
        <div className="card"><div className="card-body">
          <small className="text-muted">Total vendido</small>
          <p className="h3 mb-0">{formatPrecio(reporte.totalVentas)}</p>
        </div></div>
      </div>
      <div className="col-12 col-md-6">
        <div className="card"><div className="card-body">
          <small className="text-muted">Pedidos</small>
          <p className="h3 mb-0">{reporte.cantidadPedidos}</p>
        </div></div>
      </div>
    </div>

    <div className="table-responsive">
      <table className="table bg-white">
        <thead><tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Total</th></tr></thead>
        <tbody>
          {reporte.pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{formatFecha(p.fecha)}</td>
              <td>{p.clienteNombre}</td>
              <td>{formatPrecio(p.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}
    </>
  );
}