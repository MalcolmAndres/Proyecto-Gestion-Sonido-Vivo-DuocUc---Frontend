import http from "../api/httpClient";
import { ENDPOINTS } from "../api/endpoints";
import { mockApi } from "../mocks/mockApi";
import { USE_MOCKS } from "./config";

export const getUsuarios = () =>
  USE_MOCKS ? mockApi.getUsuarios() : http.get(ENDPOINTS.USUARIOS).then((r) => r.data);

export const crearUsuario = (datos) =>
  USE_MOCKS ? mockApi.crearUsuario(datos) : http.post(ENDPOINTS.USUARIOS, datos).then((r) => r.data);

export const actualizarUsuario = (id, datos) =>
  USE_MOCKS ? mockApi.actualizarUsuario(id, datos) : http.put(ENDPOINTS.USUARIO(id), datos).then((r) => r.data);

export const cambiarEstadoUsuario = (id, activo) =>
  USE_MOCKS
    ? mockApi.actualizarUsuario(id, { activo })
    : http.patch(ENDPOINTS.USUARIO_ESTADO(id), { activo }).then((r) => r.data);
