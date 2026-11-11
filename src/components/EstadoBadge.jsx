import { ESTADOS_PEDIDO } from "../utils/estados";

export default function EstadoBadge({ estado }) {
  const info = ESTADOS_PEDIDO[estado] ?? { texto: estado, color: "secondary" };
  return <span className={`badge bg-${info.color} text-dark`}>{info.texto}</span>;
}
