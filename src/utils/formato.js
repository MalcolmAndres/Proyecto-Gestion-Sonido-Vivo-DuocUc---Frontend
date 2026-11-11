export const formatPrecio = (valor) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(valor);

export const formatFecha = (iso) =>
  new Date(iso).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
