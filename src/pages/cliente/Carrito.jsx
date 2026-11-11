import { useCart } from "../../hooks/useCart";
import { Link } from "react-router-dom";
import { formatPrecio } from "../../utils/formato";

export default function Carrito() {

  const {
    carrito,
    totalCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    vaciarCarrito
  } = useCart();

  return (
    <>

      <h2>Mi carrito de compras</h2>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {carrito.map((producto) => (

            <div className="card mb-3" key={producto.id}>

              <div className="card-body">

                <h3>{producto.nombre}</h3>

                <p>Precio: {formatPrecio(producto.precio)}</p>

                <p>Subtotal: {formatPrecio(producto.precio * producto.cantidad)}</p>

                <p className="text-muted"> Stock disponible: {producto.stock}</p>

                {/*organiza elementos en una fila, centra verticalmente los botones, 16 px entre elementos*/}
                <div className="d-flex align-items-center gap-3">

                  {/*Disminuir cantidad*/}
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => disminuirCantidad(producto)}
                  >
                    -
                  </button>

                  <span>Cantidad: {producto.cantidad}</span>

                  {/*Aumentar cantidad*/}
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => aumentarCantidad(producto)}
                    disabled={producto.cantidad >= producto.stock}
                  >
                    +
                  </button>

                </div>

                {/*Eliminar producto*/}
                <button

                  className="btn btn-outline-danger mt-3"

                  onClick={() => eliminarProducto(producto)}
                >
                  Eliminar producto

                </button>

              </div>

            </div>


          )

          )}

          <h4>Total: {formatPrecio(totalCarrito)}</h4>

          {/*Continuar hacia la confirmación del pedido*/}
          <Link to="/checkout" className="btn btn-primario mt-3 me-2">

            Continuar compra

          </Link>

          {/*Vaciar productos del carrito*/}
          <button

            className="btn btn-danger mt-3"

            onClick={vaciarCarrito}
          >
            Vaciar carrito

          </button>



        </div>

      )}

    </>
  );
}