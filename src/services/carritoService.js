import http from "../api/httpClient";
import { ENDPOINTS } from "../api/endpoints";

// Obtener los productos del carrito
export const getCarrito = () => {
    return http.get(ENDPOINTS.CARRITO).then((r) => r.data);
};

// Agregar un producto o actualizar su cantidad
export const guardarItemCarrito = (productoId, cantidad) => {
    return http.put(ENDPOINTS.CARRITO_ITEMS, {
        productoId,
        cantidad
    }).then((r) => r.data);
};

// Eliminar un producto del carrito
export const eliminarItemCarrito = (productoId) => {
    return http.delete(ENDPOINTS.CARRITO_ITEM(productoId))
        .then((r) => r.data);
};

// Vaciar todos los productos del carrito
export const vaciarCarritoBackend = () => {
    return http.delete(ENDPOINTS.CARRITO);
};