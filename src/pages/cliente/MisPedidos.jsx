
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getMisPedidos, getPuntosRetiro } from "../../services/pedidosService";
import { useFetch } from "../../hooks/useFetch";
import { formatPrecio } from "../../utils/formato";
import { METODOS_PAGO, TIPO_ENTREGA } from "../../utils/estados";
import EstadoBadge from "../../components/EstadoBadge";

export default function MisPedidos() {

  const { usuario } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { data: puntosRetiro } = useFetch(getPuntosRetiro, []);

  // Consulta los pedidos del cliente.
  useEffect(() => {
    let activo = true;

    const cargarPedidos = async () => {
      try {
        setCargando(true);
        setError("");

        const resultado = await getMisPedidos();

        if (activo) {
          setPedidos(resultado);
        }

      } catch (error) {
        if (activo) {
          setError(error.message || "No se pudieron cargar los pedidos.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    if (usuario?.id != null) {
      cargarPedidos();
    } else {
      setPedidos([]);
      setCargando(false);
    }

    return () => {
      activo = false;
    };

  }, [usuario?.id]);

  return (
    <>

      <h2>Mis pedidos</h2>

      {cargando && <p>Cargando pedidos...</p>}

      {error && (

        <div className="alert alert-danger" role="alert">

          {error}

        </div>
      )}

      {!cargando && !error && pedidos.length === 0 && (
        <p>No tienes pedidos registrados.</p>
      )}

      {!cargando && !error && pedidos.map((pedido) => (
        <div className="card mb-3" key={pedido.id}>

          <div className="card-body">

            <h3>Pedido N° {pedido.id}</h3>

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

            <h4>

              Productos

            </h4>

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

          </div>

        </div>
      ))}

    </>
  );
}
