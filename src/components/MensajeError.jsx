export default function MensajeError({ mensaje }) {
  if (!mensaje) return null;
  return <div className="alert alert-danger">{mensaje}</div>;
}