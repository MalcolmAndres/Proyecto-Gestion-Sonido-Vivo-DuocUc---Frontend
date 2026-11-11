import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { getMisPedidos } from "../../services/pedidosService";

export default function ResultadoPago() {

  const [parametros] = useSearchParams();
  const estado = parametros.get("estado");
  const pedidoId = parametros.get("pedido");

  const { vaciarCarrito, cargandoCarrito } = useCart();
  const [verificando, setVerificando] = useState(estado === "aprobado");
  const [errorVerificacion, setErrorVerificacion] = useState(false);
  const procesadoRef = useRef(false);

  // Verificar el estado real del pedido antes de vaciar el carrito.
  useEffect(() => {

    if (estado !== "aprobado" || !pedidoId || cargandoCarrito || procesadoRef.current) {
      return;
    }

    procesadoRef.current = true;

    const verificarPago = async () => {
      try {
        const pedidos = await getMisPedidos();

        const pedido = pedidos.find(
          (item) => String(item.id) === pedidoId
        );

        if (!pedido || pedido.estado !== "EN_PREPARACION") {
          setErrorVerificacion(true);
          return;
        }

        await vaciarCarrito();

      } catch (error) {
        setErrorVerificacion(true);

      } finally {
        setVerificando(false);
      }
    };

    verificarPago();

  }, [estado, pedidoId, cargandoCarrito, vaciarCarrito]);

  // Mostrar el resultado del pago.
  const mensajes = {
    aprobado: "Tu pago fue aprobado correctamente.",
    rechazado: "Tu pago fue rechazado.",
    anulado: "El pago fue anulado.",
    error: "Ocurrió un error al procesar el pago."
  };

  const mensaje = mensajes[estado] || "No se pudo determinar el resultado del pago.";

  return (
    <div className="container mt-5">

      <h2>Resultado del pago</h2>

      <div
        className={`alert ${
          estado === "aprobado" ? "alert-success" : "alert-warning"
        } mt-3`}
        role="alert"
      >
        {mensaje}
      </div>

      {verificando && (
        <p>Verificando el pedido y actualizando el carrito...</p>
      )}

      {errorVerificacion && (
        <div className="alert alert-warning">
          No se pudo verificar el pedido. Revisa su estado en Mis pedidos.
        </div>
      )}

      <Link to="/mis-pedidos" className="btn btn-primary mt-3">
        Ver mis pedidos
      </Link>

    </div>
  );
}
