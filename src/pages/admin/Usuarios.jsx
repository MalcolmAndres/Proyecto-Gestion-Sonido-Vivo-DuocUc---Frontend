import { useEffect, useState } from "react";
import { getUsuarios, crearUsuario, actualizarUsuario, cambiarEstadoUsuario } from "../../services/usuariosService";
import { ROLES, NOMBRE_ROL } from "../../utils/roles";
import { useAuth } from "../../hooks/useAuth";

const VACIO = { nombre: "", email: "", password: "", rol: ROLES.VENDEDOR };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errorForm, setErrorForm] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [porDesactivar, setPorDesactivar] = useState(null);
  const { usuario: yo } = useAuth();

  const cargar = () => {
    setCargando(true);
    getUsuarios()
      .then(setUsuarios)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setErrorForm(null);
    setEnviando(true);
    try {
      if (editandoId) {
        const { password, ...sinClave } = form;
        await actualizarUsuario(editandoId, password ? form : sinClave);
      } else {
        await crearUsuario(form);
      }
      setEditandoId(null);
      setForm(VACIO);
      cargar();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(VACIO);
    setErrorForm(null);
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setForm({ nombre: u.nombre, email: u.email, password: "", rol: u.rol });
  };

  const toggleActivo = async (u) => {
    setErrorForm(null);
    try {
      await cambiarEstadoUsuario(u.id, !u.activo);
      cargar();
    } catch (err) {
      setErrorForm(err.message);
    }
  };

  const confirmarDesactivar = async () => {
    await toggleActivo(porDesactivar);
    setPorDesactivar(null);
  };

  if (cargando) return <p>Cargando usuarios...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-4">
        <form onSubmit={guardar}>
          <h2 className="h5">{editandoId ? "Editar usuario" : "Nuevo usuario"}</h2>
          {errorForm && <div className="alert alert-danger">{errorForm}</div>}
          <input name="nombre" className="form-control mb-2" placeholder="Nombre" value={form.nombre} onChange={onChange} required />
          <input name="email" type="email" className="form-control mb-2" placeholder="Correo" value={form.email} onChange={onChange} required />
          <input name="password" type="password" className="form-control mb-2" placeholder="Contraseña" value={form.password} onChange={onChange} required={!editandoId} />
          <select name="rol" className="form-select mb-3" value={form.rol} onChange={onChange}>
            {Object.values(ROLES).map((r) => (
              <option key={r} value={r}>{NOMBRE_ROL[r]}</option>
            ))}
          </select>
          <div className="d-flex gap-2">
            <button className="btn btn-primario" disabled={enviando}>
              {enviando ? "Guardando..." : editandoId ? "Guardar" : "Crear"}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>Cancelar</button>
            )}
          </div>
        </form>
      </div>
      <div className="col-12 col-lg-8">
        {porDesactivar && (
          <div className="alert alert-warning d-flex flex-column flex-sm-row align-items-sm-center gap-2">
            <span className="me-auto">¿Desactivar a <strong>{porDesactivar.nombre}</strong>? No podrá iniciar sesión.</span>
            <button className="btn btn-sm btn-danger" onClick={confirmarDesactivar}>Sí, desactivar</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setPorDesactivar(null)}>Cancelar</button>
          </div>
        )}
        <div className="table-responsive">
          <table className="table align-middle bg-white">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{NOMBRE_ROL[u.rol]}</td>
                  <td>
                    <span className={`badge ${u.activo ? "bg-success" : "bg-secondary"}`}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-dark me-1" onClick={() => editar(u)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger"
                      disabled={u.id === yo?.id}
                      title={u.id === yo?.id ? "No puedes desactivar tu propia cuenta" : undefined}
                      onClick={() => (u.activo ? setPorDesactivar(u) : toggleActivo(u))}>
                      {u.activo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}