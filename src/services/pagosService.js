
import http from "../api/httpClient";
import { ENDPOINTS } from "../api/endpoints";

// Inicia una transacción de Webpay para un pedido.
export const iniciarPago = async (pedidoId) => {
  const respuesta = await http.post(ENDPOINTS.PAGOS_INICIAR, {
    pedidoId
  });

  return respuesta.data;
};
