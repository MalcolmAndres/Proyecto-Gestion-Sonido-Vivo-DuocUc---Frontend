import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";

// Arma un mini-router con: una página protegida, el login y no-autorizado
const dibujar = (usuario) =>
  render(
    <AuthContext.Provider value={{ usuario }}>
      <MemoryRouter initialEntries={["/admin/usuarios"]}>
        <Routes>
          <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route path="/admin/usuarios" element={<p>Panel de usuarios</p>} />
          </Route>
          <Route path="/login" element={<p>Página de login</p>} />
          <Route path="/no-autorizado" element={<p>No autorizado</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe("ProtectedRoute", () => {
  // Prueba 15
  it("sin sesión manda al login", () => {
    dibujar(null);
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  // Prueba 16
  it("un CLIENTE no puede entrar a una ruta de ADMIN", () => {
    dibujar({ id: 3, nombre: "Cliente Demo", rol: "CLIENTE" });
    expect(screen.getByText("No autorizado")).toBeInTheDocument();
    expect(screen.queryByText("Panel de usuarios")).not.toBeInTheDocument();
  });

  // Prueba 17
  it("un ADMIN sí ve la página", () => {
    dibujar({ id: 1, nombre: "Dueño", rol: "ADMIN" });
    expect(screen.getByText("Panel de usuarios")).toBeInTheDocument();
  });
});
