import { useEffect, useState } from "react";
import {
  getPedidos,
  actualizarEstadoPedido,
  getPuntosRetiro
} from "../../services/pedidosService";
import { useFetch } from "../../hooks/useFetch";
import { formatPrecio } from "../../utils/formato";
import { METODOS_PAGO, TIPO_ENTREGA } from "../../utils/estados";
import EstadoBadge from "../../components/EstadoBadge";

export default function GestionPedidos() {

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);
  const { data: puntosRetiro } = useFetch(getPuntosRetiro, []);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const resultado = await getPedidos();
        setPedidos(resultado);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      setActualizandoId(id);
      setError("");

      const pedidoActualizado = await actualizarEstadoPedido(
        id,
        nuevoEstado
      );

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) =>
          pedido.id === id
            ? { ...pedidoActualizado }
            : pedido
        )
      );

    } catch (error) {
      setError(error.message);
    } finally {
      setActualizandoId(null);
    }
  };


  return (
    <>

      <h2>Gestión de pedidos</h2>

      {cargando && <p>Cargando pedidos...</p>}

      {error && (

        <div className="alert alert-danger" role="alert">

          {error}

        </div>
      )}

      {!cargando && pedidos.length === 0 && (
        <p>No hay pedidos registrados.</p>
      )}

      {!cargando && pedidos.map((pedido) => (

        <div className="card mb-3" key={pedido.id}>

          <div className="card-body">

            <h5>Pedido N° {pedido.id}</h5>

            <p>

              Cliente: {pedido.clienteNombre ?? `#${pedido.usuarioId}`}

            </p>

            <p>

              Fecha: {new Date(pedido.fecha).toLocaleString("es-CL")}

            </p>

            <p>

              Estado: <EstadoBadge estado={pedido.estado} />

            </p>

            <p>
              Método de pago: {METODOS_PAGO[pedido.metodoPago] ?? "No registrado"}
            </p>

            <p>
              Tipo de entrega: {TIPO_ENTREGA[pedido.tipoEntrega]}
            </p>

            {pedido.tipoEntrega === "DESPACHO" && (

              <p>Dirección: {pedido.direccion}</p>

            )}

            {pedido.tipoEntrega === "RETIRO_TIENDA" && (
              <p>
                Punto de retiro: {
                  puntosRetiro?.find(
                    (punto) => String(punto.id) === String(pedido.puntoRetiro)
                  )?.nombre || "No disponible"
                }
              </p>
            )}

            <h6>Productos</h6>

            <ul>

              {pedido.productos.map((producto) => (

                <li key={producto.id}>
                  {producto.nombre} - Cantidad: {producto.cantidad}
                </li>

              ))}

            </ul>

            <h5>

              Total: {formatPrecio(pedido.total)}

            </h5>

            <label
              className="form-label"
              htmlFor={`estado-${pedido.id}`}
            >
              Cambiar estado

            </label>

            <select

              id={`estado-${pedido.id}`}
              className="form-select"
              value={pedido.estado}
              disabled={
                actualizandoId === pedido.id ||
                pedido.estado === "ENTREGADO"
              }
              onChange={(e) =>
                cambiarEstado(pedido.id, e.target.value)
              }
            >
              <option value="EN_PREPARACION" disabled={pedido.estado !== "EN_PREPARACION"}>

                En preparación

              </option>

              <option value="DESPACHADO" disabled={pedido.estado !== "EN_PREPARACION"}>

                Despachado

              </option>

              <option value="ENTREGADO" disabled={pedido.estado !== "DESPACHADO"}>

                Entregado

              </option>

            </select>

          </div>
        </div>

      ))}

    </>
  );
}
