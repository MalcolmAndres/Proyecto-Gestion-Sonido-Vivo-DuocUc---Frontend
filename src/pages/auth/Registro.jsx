import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Registro() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { registro } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    if (!form.nombre.trim()) return "Ingresa tu nombre";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Ingresa un correo válido";
    if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    if (form.password !== form.confirmar) return "Las contraseñas no coinciden";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const mensaje = validar();
    if (mensaje) return setError(mensaje);
    setError(null);
    setEnviando(true);
    try {
      await registro({ nombre: form.nombre, email: form.email, password: form.password });
      navigate("/catalogo", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="h5 mb-3">Crear cuenta</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label" htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" className="form-control" value={form.nombre} onChange={onChange} />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onChange} />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={onChange} />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="confirmar">Repetir contraseña</label>
        <input id="confirmar" name="confirmar" type="password" className="form-control" value={form.confirmar} onChange={onChange} />
      </div>
      <button className="btn btn-primario w-100" disabled={enviando}>
        {enviando ? "Creando cuenta..." : "Registrarme"}
      </button>
      <p className="text-center mt-3 mb-0 small">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  );
}