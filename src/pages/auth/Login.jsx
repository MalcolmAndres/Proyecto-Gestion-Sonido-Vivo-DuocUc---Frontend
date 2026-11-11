import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { INICIO_POR_ROL } from "../../utils/roles";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const usuario = await login(form.email, form.password);
      navigate(INICIO_POR_ROL[usuario.rol], { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="h5 mb-3">Iniciar sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="form-control"
          value={form.email} onChange={onChange} />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" className="form-control"
          value={form.password} onChange={onChange} />
      </div>
      <button className="btn btn-primario w-100" disabled={enviando}>
        {enviando ? "Ingresando..." : "Ingresar"}
      </button>
      <p className="text-center mt-3 mb-0 small">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </form>
  );
}