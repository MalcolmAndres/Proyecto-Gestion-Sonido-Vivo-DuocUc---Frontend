// Deben coincidir EXACTO con los enums EstadoPedido y TipoEntrega en Java.
export const ESTADOS_PEDIDO = {
  EN_PREPARACION: { texto: "En preparación", color: "warning" },
  DESPACHADO: { texto: "Despachado", color: "info" },
  ENTREGADO: { texto: "Entregado", color: "success" },
};

export const TIPO_ENTREGA = {
  DESPACHO: "Despacho a domicilio",
  RETIRO_TIENDA: "Retiro en tienda",
};


export const METODOS_PAGO = {
  TRANSFERENCIA: "Transferencia bancaria",
  TARJETA: "Tarjeta de débito o crédito",
  EFECTIVO: "Efectivo al retirar",
};
