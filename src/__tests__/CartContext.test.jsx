import { renderHook, act } from "@testing-library/react";
import { AuthContext } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { useCart } from "../hooks/useCart";

const bajo = { id: 10, nombre: "Bajo", precio: 200000, stock: 2 };

// El carrito usa useAuth(), así que lo envolvemos con un usuario logueado falso
const envoltorio = ({ children }) => (
  <AuthContext.Provider value={{ usuario: { id: 3, rol: "CLIENTE" } }}>
    <CartProvider>{children}</CartProvider>
  </AuthContext.Provider>
);

beforeEach(() => {
  localStorage.clear();
});

describe("CartContext", () => {
  // Prueba 20
  it("agregar el mismo producto dos veces suma la cantidad, el total y avisa", () => {
    const { result } = renderHook(() => useCart(), { wrapper: envoltorio });

    act(() => result.current.agregarProducto(bajo));
    act(() => result.current.agregarProducto(bajo));

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].cantidad).toBe(2);
    expect(result.current.totalCarrito).toBe(400000);
    expect(result.current.aviso.tipo).toBe("ok");
  });

  // Prueba 21
  it("no deja agregar más unidades que el stock y muestra aviso de error", () => {
    const { result } = renderHook(() => useCart(), { wrapper: envoltorio });

    act(() => result.current.agregarProducto(bajo));
    act(() => result.current.agregarProducto(bajo));
    act(() => result.current.agregarProducto(bajo)); // la 3ª no debería entrar (stock 2)

    expect(result.current.carrito[0].cantidad).toBe(2);
    expect(result.current.aviso.tipo).toBe("error");
  });
});
