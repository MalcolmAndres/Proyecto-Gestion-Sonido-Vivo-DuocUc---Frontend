import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../components/ProductCard";

// Producto de ejemplo (no hace falta usar el JSON real)
const guitarra = {
  id: 1,
  nombre: "Guitarra de prueba",
  marca: "Yamaha",
  categoria: "Guitarras",
  precio: 100000,
  stock: 5,
  imagenUrl: "https://placehold.co/400x300",
};

// ProductCard tiene un <Link>, por eso necesita estar dentro de un Router
const dibujar = (props) =>
  render(
    <MemoryRouter>
      <ProductCard producto={guitarra} {...props} />
    </MemoryRouter>
  );

describe("ProductCard", () => {
  // Prueba 12
  it("sin onAgregar NO muestra el botón (vendedor/admin)", () => {
    dibujar();
    expect(screen.queryByRole("button", { name: /agregar al carrito/i })).not.toBeInTheDocument();
  });

  // Prueba 13
  it("al hacer clic en 'Agregar al carrito' llama a onAgregar con el producto", async () => {
    const onAgregar = vi.fn(); // función espía
    dibujar({ onAgregar });

    await userEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(guitarra);
  });

  // Prueba 14
  it("si no hay stock el botón aparece deshabilitado", () => {
    render(
      <MemoryRouter>
        <ProductCard producto={{ ...guitarra, stock: 0 }} onAgregar={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /agregar al carrito/i })).toBeDisabled();
    expect(screen.getByText("Sin stock")).toBeInTheDocument();
  });
});
