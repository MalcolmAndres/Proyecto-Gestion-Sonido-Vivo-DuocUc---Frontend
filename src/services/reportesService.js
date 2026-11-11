import http from "../api/httpClient";
import { ENDPOINTS } from "../api/endpoints";
import { mockApi } from "../mocks/mockApi";
import { USE_MOCKS } from "./config";
export const getReporteVentas = ({ desde, hasta }) =>
  USE_MOCKS
    ? mockApi.getReporteVentas({ desde, hasta })
    : http.get(ENDPOINTS.REPORTE_VENTAS, { params: { desde, hasta } }).then((r) => r.data);