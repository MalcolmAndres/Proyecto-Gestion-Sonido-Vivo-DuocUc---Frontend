import http from "../api/httpClient";
import { ENDPOINTS } from "../api/endpoints";
import { mockApi } from "../mocks/mockApi";
import { USE_MOCKS } from "./config";

export const login = (credenciales) =>
  USE_MOCKS
    ? mockApi.login(credenciales)
    : http.post(ENDPOINTS.AUTH_LOGIN, credenciales).then((r) => r.data);

export const registro = (datos) =>
  USE_MOCKS
    ? mockApi.registro(datos)
    : http.post(ENDPOINTS.AUTH_REGISTRO, datos).then((r) => r.data);
