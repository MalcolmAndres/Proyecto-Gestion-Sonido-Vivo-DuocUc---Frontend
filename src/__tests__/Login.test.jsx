import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/auth/Login";

// En vez del AuthProvider real, le pasamos un "login" falso que nosotros controlamos
const dibujar = (loginFalso) =>
  render(
    <AuthContext.Provider value={{ usuario: null, login: loginFalso }}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<p>Catálogo</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe("Login", () => {
  // Prueba 18
  it("muestra el error cuando las credenciales son incorrectas", async () => {
    const loginFalso = vi.fn().mockRejectedValue(new Error("Correo o contraseña incorrectos"));
    dibujar(loginFalso);

    await userEvent.type(screen.getByLabelText("Correo"), "cliente@correo.cl");
    await userEvent.type(screen.getByLabelText("Contraseña"), "mala");
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(loginFalso).toHaveBeenCalledWith("cliente@correo.cl", "mala");
    expect(await screen.findByText("Correo o contraseña incorrectos")).toBeInTheDocument();
  });

  // Prueba 19
  it("si el login funciona, lleva al CLIENTE al catálogo", async () => {
    const loginFalso = vi.fn().mockResolvedValue({ id: 3, rol: "CLIENTE" });
    dibujar(loginFalso);

    await userEvent.type(screen.getByLabelText("Correo"), "cliente@correo.cl");
    await userEvent.type(screen.getByLabelText("Contraseña"), "cliente123");
    await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(await screen.findByText("Catálogo")).toBeInTheDocument();
  });
});
