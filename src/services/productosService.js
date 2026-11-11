import http from "../api/httpClient";
import { ENDPOINTS } from "../api/endpoints";
import { mockApi } from "../mocks/mockApi";
import { USE_MOCKS } from "./config";

export const getProductos = (filtros = {}) =>
  USE_MOCKS
    ? mockApi.getProductos(filtros)
    : http.get(ENDPOINTS.PRODUCTOS, { params: filtros }).then((r) => r.data);

export const getProducto = (id) =>
  USE_MOCKS ? mockApi.getProducto(id) : http.get(ENDPOINTS.PRODUCTO(id)).then((r) => r.data);

export const getCategorias = () =>
  USE_MOCKS ? mockApi.getCategorias() : http.get(ENDPOINTS.CATEGORIAS).then((r) => r.data);

export const actualizarStock = (id, stock) =>
  USE_MOCKS
    ? mockApi.actualizarStock(id, stock)
    : http.put(ENDPOINTS.PRODUCTO_STOCK(id), { stock }).then((r) => r.data);