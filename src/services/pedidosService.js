
import { mockApi } from "../mocks/mockApi";
import { USE_MOCKS } from "./config";
import http from "../api/httpClient";
import { ENDPOINTS } from "../api/endpoints";

// Registra un pedido.
export const crearPedido = (datos) => {
    if (USE_MOCKS) {
        return mockApi.crearPedido(datos);
    }

    return http.post(ENDPOINTS.PEDIDOS, datos).then((r) => r.data);
};

// Obtiene los pedidos del cliente.
export const getMisPedidos = () => {
    if (USE_MOCKS) {
        return mockApi.getMisPedidos();
    }

    return http.get(ENDPOINTS.MIS_PEDIDOS).then((r) => r.data);
};

// Obtiene todos los pedidos.
export const getPedidos = () => {
    if (USE_MOCKS) {
        return mockApi.getPedidos();
    }

    return http.get(ENDPOINTS.PEDIDOS).then((r) => r.data);
};

// Actualiza el estado de un pedido.
export const actualizarEstadoPedido = (id, estado) => {
    if (USE_MOCKS) {
        return mockApi.actualizarEstadoPedido(id, estado);
    }

    return http.patch(ENDPOINTS.PEDIDO_ESTADO(id), { estado })
        .then((r) => r.data);
};

// Obtiene los puntos de retiro disponibles.
export const getPuntosRetiro = () => {
    if (USE_MOCKS) {
        return mockApi.getPuntosRetiro();
    }

    return http.get(ENDPOINTS.PUNTOS_RETIRO).then((r) => r.data);
};
