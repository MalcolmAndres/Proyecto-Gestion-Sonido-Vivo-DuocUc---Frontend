import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES, NOMBRE_ROL } from "../utils/roles";
import { useCart } from "../hooks/useCart";

const { ADMIN, VENDEDOR, CLIENTE } = ROLES;

const LINKS = [
  { to: "/catalogo", texto: "Catálogo", roles: [CLIENTE, VENDEDOR, ADMIN] },
  { to: "/carrito", texto: "Carrito", roles: [CLIENTE] },
  { to: "/mis-pedidos", texto: "Mis pedidos", roles: [CLIENTE] },
  { to: "/ubicacion", texto: "Ubicación", roles: [CLIENTE, VENDEDOR, ADMIN] },
  { to: "/gestion/pedidos", texto: "Pedidos", roles: [VENDEDOR, ADMIN] },
  { to: "/gestion/stock", texto: "Stock", roles: [VENDEDOR, ADMIN] },
  { to: "/admin/usuarios", texto: "Usuarios", roles: [ADMIN] },
  { to: "/admin/reportes", texto: "Reportes", roles: [ADMIN] },
];

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const visibles = LINKS.filter((l) => l.roles.includes(usuario?.rol));
  const { carrito } = useCart();

  const cantidadCarrito = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  const salir = () => {
    setAbierto(false);
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand brand" to="/" onClick={() => setAbierto(false)}>Sonido Vivo</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${abierto ? "show" : ""}`}>
          <ul className="navbar-nav me-auto">
            {visibles.map((l) => (
              <li className="nav-item" key={l.to}>
                <NavLink className="nav-link" to={l.to} onClick={() => setAbierto(false)}
                >
                  {l.texto}
                  {l.to === "/carrito" && ` (${cantidadCarrito})`}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
            <span className="navbar-text small">
              {usuario?.nombre} · {NOMBRE_ROL[usuario?.rol]}
            </span>
            <button className="btn btn-outline-warning btn-sm" onClick={salir}>Salir</button>
          </div>
        </div>
      </div>
    </nav>
  );
}