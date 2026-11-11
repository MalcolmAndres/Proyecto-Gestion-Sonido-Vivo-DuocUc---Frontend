import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import PublicLayout from "../layouts/PublicLayout";
import { useAuth } from "../hooks/useAuth";
import { ROLES, INICIO_POR_ROL } from "../utils/roles";

import Login from "../pages/auth/Login";
import Registro from "../pages/auth/Registro";
import Catalogo from "../pages/cliente/Catalogo";
import DetalleProducto from "../pages/cliente/DetalleProducto";
import Carrito from "../pages/cliente/Carrito";
import Checkout from "../pages/cliente/Checkout";
import ResultadoPago from "../pages/cliente/ResultadoPago";
import MisPedidos from "../pages/cliente/MisPedidos";
import Ubicacion from "../pages/cliente/Ubicacion";
import GestionPedidos from "../pages/vendedor/GestionPedidos";
import GestionStock from "../pages/vendedor/GestionStock";
import Usuarios from "../pages/admin/Usuarios";
import Reportes from "../pages/admin/Reportes";
import NoAutorizado from "../pages/NoAutorizado";
import Home from "../pages/Home";
const { ADMIN, VENDEDOR, CLIENTE } = ROLES;



export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas: solo login y registro (regla de seguridad del enunciado) */}
      <Route path="/" element={<Home />} />
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      {/* Resultado del pago con Webpay */}
      <Route path="/pago/resultado" element={<ResultadoPago />} />

      {/* Todo lo demás requiere sesión */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          {/* Cualquier usuario logueado */}
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/ubicacion" element={<Ubicacion />} />

          {/* Cliente */}
          <Route element={<ProtectedRoute roles={[CLIENTE]} />}>
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
          </Route>

          {/* Vendedor y Admin */}
          <Route element={<ProtectedRoute roles={[VENDEDOR, ADMIN]} />}>
            <Route path="/gestion/pedidos" element={<GestionPedidos />} />
            <Route path="/gestion/stock" element={<GestionStock />} />
          </Route>

          {/* Solo Admin */}
          <Route element={<ProtectedRoute roles={[ADMIN]} />}>
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/reportes" element={<Reportes />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
