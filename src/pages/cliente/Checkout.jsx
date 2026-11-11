import { useCart } from "../../hooks/useCart";
import { useState } from "react";
import Mapa from "../../components/Mapa";
import { useAuth } from "../../hooks/useAuth";
import { crearPedido, getPuntosRetiro } from "../../services/pedidosService";
import { iniciarPago } from "../../services/pagosService";
import { useFetch } from "../../hooks/useFetch";
import { formatPrecio } from "../../utils/formato";
import { METODOS_PAGO } from "../../utils/estados";

export default function Checkout() {

  const { carrito, totalCarrito, vaciarCarrito } = useCart();// se obtiene los productos y total de carrito
  const { usuario } = useAuth();// se obtiene el usuario que inició sesión
  const [tipoEntrega, setTipoEntrega] = useState("RETIRO_TIENDA");
  const [direccion, setDireccion] = useState("");
  const [puntoRetiro, setPuntoRetiro] = useState("");
  const [mensaje, setMensaje] = useState(""); // mensaje validación pedido
  const [procesando, setProcesando] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const { data: puntosRetiro } = useFetch(getPuntosRetiro, []);

  // valida los datos de entrega y registra el pedido
  const validarPedido = async () => {

    if (procesando) return;

    if (carrito.length === 0) {
      setMensaje("El carrito está vacío.");
      return;
    }

    if (!usuario) {
      setMensaje("Debe iniciar sesión para confirmar el pedido.");
      return;
    }

    if (tipoEntrega === "RETIRO_TIENDA" && !puntoRetiro) {
      setMensaje("Debe seleccionar un punto de retiro.");
      return;
    }

    if (tipoEntrega === "DESPACHO" && !direccion.trim()) {
      setMensaje("Debe ingresar una dirección de despacho.");
      return;
    }

    if (!metodoPago) {
      setMensaje("Debe seleccionar un método de pago.");
      return;
    }

    const datosPedido = {
      productos: carrito.map((producto) => ({
        id: producto.id,
        cantidad: producto.cantidad,
      })),
      metodoPago,
      tipoEntrega,
      direccion: tipoEntrega === "DESPACHO" ? direccion.trim() : null,
      puntoRetiro: tipoEntrega === "RETIRO_TIENDA" ? Number(puntoRetiro) : null,
    };

    try {
      setProcesando(true);
      setMensaje("");

      const pedido = await crearPedido(datosPedido);

      // Si paga con tarjeta, inicia la transacción en Webpay.
      if (metodoPago === "TARJETA") {

        const respuestaPago = await iniciarPago(pedido.id);

        // Crea un formulario para enviar el token a Webpay.
        const formulario = document.createElement("form");
        formulario.method = "POST";
        formulario.action = respuestaPago.url;

        const token = document.createElement("input");
        token.type = "hidden";
        token.name = "token_ws";
        token.value = respuestaPago.token;

        formulario.appendChild(token);
        document.body.appendChild(formulario);
        formulario.submit();

        return;
      }

      // Transferencia y efectivo mantienen su funcionamiento.
      setMensaje(`Pedido N° ${pedido.id} registrado correctamente.`);

      try {
        await vaciarCarrito();
      } catch (error) {
        setMensaje(`Pedido N° ${pedido.id} registrado, pero no se pudo vaciar el carrito.`);
      }

    } catch (error) {
      setMensaje(error.message || "No se pudo registrar el pedido.");
    } finally {
      setProcesando(false);
    }
  };


  return (
    <>

      <h2>Confirmar pedido</h2>

      {/* mensaje de validación o de pedido registrado: queda fuera del bloque del carrito
          para que se vea aunque el carrito quede vacío después de comprar */}
      {mensaje && (
        <div className="alert alert-info mt-3" role="alert">
          {mensaje}
        </div>
      )}

      <h3 className="mt-4">Resumen de compra</h3>

      {carrito.length === 0 ? (
        <p>No tienes productos para comprar.</p>
      ) : (
        <div>
          {carrito.map((producto) => (
            <div
              className="card mb-3"
              key={producto.id}
            >
              <div className="card-body">

                <h5>{producto.nombre}</h5>

                <p>Cantidad: {producto.cantidad}</p>

                <p>Subtotal: {formatPrecio(producto.precio * producto.cantidad)}</p>

              </div>

            </div>
          ))}

          <h4>

            Total: {formatPrecio(totalCarrito)}

          </h4>

          {/*Selección del tipo de entrega*/}
          <section className="mt-4">

            <h5>Tipo de entrega</h5>

            <div className="form-check">

              <input
                className="form-check-input"
                type="radio"
                name="tipoEntrega"
                id="retiro"
                value="RETIRO_TIENDA"
                checked={tipoEntrega === "RETIRO_TIENDA"}
                onChange={() => setTipoEntrega("RETIRO_TIENDA")}
              />

              <label className="form-check-label" htmlFor="retiro">

                Retiro en tienda

              </label>

            </div>

            <div className="form-check">

              <input
                className="form-check-input"
                type="radio"
                name="tipoEntrega"
                id="domicilio"
                value="DESPACHO"
                checked={tipoEntrega === "DESPACHO"}
                onChange={() => setTipoEntrega("DESPACHO")}
              />

              <label className="form-check-label" htmlFor="domicilio">

                Despacho a domicilio

              </label>

            </div>

            {/*muestra la dirección cuando se selecciona un despacho*/}
            {tipoEntrega === "DESPACHO" && (

              <div className="mt-3">

                <label htmlFor="direccion" className="form-label">

                  Dirección de despacho

                </label>

                <input

                  type="text"
                  id="direccion"
                  className="form-control"
                  placeholder="Ingrese su dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)} />

              </div>
            )}

            {/*muestra los puntos disponibles para retiro*/}
            {tipoEntrega === "RETIRO_TIENDA" && (

              <div className="mt-3">

                <label htmlFor="puntoRetiro" className="form-label">

                  Punto de retiro

                </label>

                <select

                  id="puntoRetiro"
                  className="form-select"
                  value={puntoRetiro}
                  onChange={(e) => setPuntoRetiro(e.target.value)}
                >
                  <option value="">Seleccione un punto de retiro</option>

                  {puntosRetiro?.map((punto) => (
                    <option key={punto.id} value={punto.id}>
                      {punto.nombre}
                    </option>
                  ))}

                </select>

                <Mapa puntos={puntosRetiro} puntoSeleccionado={puntoRetiro} />

              </div>

            )}

          </section>


          {/* Selección del método de pago */}
          <section className="mt-4">
            <h5>Método de pago</h5>

            <div className="mb-3">
              <label htmlFor="metodoPago" className="form-label">
                Seleccione cómo desea pagar
              </label>

              <select
                id="metodoPago"
                className="form-select"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="">Seleccione un método de pago</option>
                {Object.entries(METODOS_PAGO).map(([valor, texto]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
              </select>
            </div>

            <p className="text-muted small">
              El pago es simulado. No se realizarán cobros reales.
            </p>
          </section>


          {/*validar pedido*/}


          <button

            type="button"
            className="btn btn-primario mt-3"
            onClick={validarPedido}
            disabled={procesando}
          >
            {procesando ? "Registrando pedido..." : "Confirmar pedido"}

          </button>

        </div>
      )}

    </>

  );

}
