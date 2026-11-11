import { createContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
    getCarrito,
    guardarItemCarrito,
    eliminarItemCarrito,
    vaciarCarritoBackend
} from "../services/carritoService";
import { getProducto } from "../services/productosService";

// Contexto para compartir los datos del carrito
export const CartContext = createContext(null);

export function CartProvider({ children }) {

    const { usuario } = useAuth();

    const [carrito, setCarrito] = useState([]);
    const [cargandoCarrito, setCargandoCarrito] = useState(true);
    const [procesandoCarrito, setProcesandoCarrito] = useState(false);
    const [aviso, setAviso] = useState(null);

    // Referencias para evitar operaciones simultáneas
    const procesandoRef = useRef(false);
    const carritoRef = useRef([]);
    const usuarioRef = useRef(usuario);

    usuarioRef.current = usuario;

    const cerrarAviso = () => setAviso(null);

    // Actualizar el carrito en React y su referencia
    const actualizarCarrito = (productos) => {
        carritoRef.current = productos;
        setCarrito(productos);
    };

    // Mostrar los errores del backend
    const mostrarError = (error) => {
        setAviso({
            tipo: "error",
            texto: error.message || "Error de comunicación con el servidor."
        });
    };

    // Bloquear operaciones mientras se procesa una solicitud
    const iniciarOperacion = () => {
        if (procesandoRef.current || cargandoCarrito || !usuarioRef.current) {
            return false;
        }

        procesandoRef.current = true;
        setProcesandoCarrito(true);
        return true;
    };

    const finalizarOperacion = () => {
        procesandoRef.current = false;
        setProcesandoCarrito(false);
    };

    // Recuperar el carrito del usuario desde MySQL
    useEffect(() => {
        let cancelado = false;

        const cargarCarrito = async () => {
            actualizarCarrito([]);
            setCargandoCarrito(true);
            setAviso(null);

            if (!usuario || usuario.rol !== "CLIENTE") {
                setCargandoCarrito(false);
                return;
            }

            try {
                // Obtener IDs y cantidades desde ms-carrito
                const items = await getCarrito();

                // Obtener los detalles desde ms-catalogo
                const productos = await Promise.all(
                    items.map(async (item) => {
                        const producto = await getProducto(item.productoId);

                        return {
                            ...producto,
                            cantidad: item.cantidad
                        };
                    })
                );

                if (!cancelado) {
                    actualizarCarrito(productos);
                }

            } catch (error) {
                if (!cancelado) {
                    mostrarError(error);
                }

            } finally {
                if (!cancelado) {
                    setCargandoCarrito(false);
                }
            }
        };

        cargarCarrito();

        return () => {
            cancelado = true;
        };
    }, [usuario]);

    // Agregar un producto al carrito
    const agregarProducto = async (producto) => {

        if (!iniciarOperacion()) return;

        try {
            const productoExistente = carritoRef.current.find(
                (item) => item.id === producto.id
            );

            const cantidadActual = productoExistente
                ? productoExistente.cantidad
                : 0;

            const nuevaCantidad = cantidadActual + 1;

            // Validar stock disponible
            if (nuevaCantidad > producto.stock) {
                setAviso({
                    tipo: "error",
                    texto: `No hay más stock disponible de ${producto.nombre}.`
                });
                return;
            }

            // Guardar primero en ms-carrito
            await guardarItemCarrito(producto.id, nuevaCantidad);

            const productosActualizados = productoExistente
                ? carritoRef.current.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
                : [
                    ...carritoRef.current,
                    { ...producto, cantidad: nuevaCantidad }
                ];

            actualizarCarrito(productosActualizados);

            setAviso({
                tipo: "ok",
                texto: `${producto.nombre} se agregó al carrito.`
            });

        } catch (error) {
            mostrarError(error);

        } finally {
            finalizarOperacion();
        }
    };

    // Aumentar la cantidad de un producto
    const aumentarCantidad = async (producto) => {

        if (!iniciarOperacion()) return;

        try {
            const productoExistente = carritoRef.current.find(
                (item) => item.id === producto.id
            );

            if (!productoExistente ||
                productoExistente.cantidad >= producto.stock) {
                return;
            }

            const nuevaCantidad = productoExistente.cantidad + 1;

            await guardarItemCarrito(producto.id, nuevaCantidad);

            actualizarCarrito(
                carritoRef.current.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
            );

        } catch (error) {
            mostrarError(error);

        } finally {
            finalizarOperacion();
        }
    };

    // Disminuir la cantidad de un producto
    const disminuirCantidad = async (producto) => {

        if (!iniciarOperacion()) return;

        try {
            const productoExistente = carritoRef.current.find(
                (item) => item.id === producto.id
            );

            if (!productoExistente) return;

            const nuevaCantidad = productoExistente.cantidad - 1;

            // Si queda en cero, eliminarlo
            if (nuevaCantidad <= 0) {
                await eliminarItemCarrito(producto.id);

                actualizarCarrito(
                    carritoRef.current.filter(
                        (item) => item.id !== producto.id
                    )
                );

                return;
            }

            await guardarItemCarrito(producto.id, nuevaCantidad);

            actualizarCarrito(
                carritoRef.current.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
            );

        } catch (error) {
            mostrarError(error);

        } finally {
            finalizarOperacion();
        }
    };

    // Eliminar un producto del carrito
    const eliminarProducto = async (producto) => {

        if (!iniciarOperacion()) return;

        try {
            await eliminarItemCarrito(producto.id);

            actualizarCarrito(
                carritoRef.current.filter(
                    (item) => item.id !== producto.id
                )
            );

        } catch (error) {
            mostrarError(error);

        } finally {
            finalizarOperacion();
        }
    };

    // Vaciar todos los productos del carrito
    const vaciarCarrito = async () => {

        if (!iniciarOperacion()) return;

        try {
            await vaciarCarritoBackend();

            actualizarCarrito([]);

        } catch (error) {
            mostrarError(error);

        } finally {
            finalizarOperacion();
        }
    };

    // Calcular el total del carrito
    const totalCarrito = carrito.reduce((total, producto) => {
        return total + (producto.precio * producto.cantidad);
    }, 0);

    return (
        <CartContext.Provider
            value={{
                carrito,
                agregarProducto,
                eliminarProducto,
                aumentarCantidad,
                disminuirCantidad,
                vaciarCarrito,
                totalCarrito,
                cargandoCarrito,
                procesandoCarrito,
                aviso,
                cerrarAviso
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
