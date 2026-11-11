// Pruebas de la API falsa: aquí vive la lógica de negocio (login, pedidos, stock).
import { mockApi } from "../mocks/mockApi";

// Antes de cada prueba: sesión limpia (sin token)
beforeEach(() => {
  localStorage.clear();
});

describe("mockApi - usuarios (Persona 1)", () => {
  // Prueba 3
  it("login correcto devuelve token y NO devuelve la contraseña", async () => {
    const respuesta = await mockApi.login({ email: "cliente@correo.cl", password: "cliente123" });

    expect(respuesta.token).toBe("mock-token-3");
    expect(respuesta.usuario.rol).toBe("CLIENTE");
    expect(respuesta.usuario.password).toBeUndefined();
  });

  // Prueba 4
  it("login con contraseña incorrecta lanza error", async () => {
    await expect(
      mockApi.login({ email: "cliente@correo.cl", password: "mala" })
    ).rejects.toThrow("Correo o contraseña incorrectos");
  });

  // Prueba 5
  it("un usuario desactivado no puede iniciar sesión", async () => {
    await expect(
      mockApi.login({ email: "inactivo@sonidovivo.cl", password: "inactivo123" })
    ).rejects.toThrow("Tu cuenta está desactivada");
  });

  // Prueba 6
  it("no se puede registrar un correo que ya existe", async () => {
    await expect(
      mockApi.registro({ nombre: "Copia", email: "admin@sonidovivo.cl", password: "123456" })
    ).rejects.toThrow("Ese correo ya está registrado");
  });
});

describe("mockApi - pedidos (Persona 3)", () => {
  // Prueba 7
  it("no se puede comprar sin iniciar sesión", async () => {
    await expect(
      mockApi.crearPedido({ productos: [{ id: 1, cantidad: 1 }] })
    ).rejects.toThrow("Debes iniciar sesión para comprar.");
  });

  // Prueba 8
  it("el precio sale de la base de datos y se descuenta el stock", async () => {
    localStorage.setItem("token", "mock-token-3"); // simula al cliente logueado
    const antes = await mockApi.getProducto(1);

    const pedido = await mockApi.crearPedido({
      productos: [{ id: 1, cantidad: 1, precio: 1 }], // precio "trucho" que debe ignorarse
      metodoPago: "TARJETA",
      tipoEntrega: "RETIRO_TIENDA",
      puntoRetiro: 1,
    });

    expect(pedido.total).toBe(antes.precio);
    expect(pedido.usuarioId).toBe(3);
    expect(pedido.estado).toBe("EN_PREPARACION");

    const despues = await mockApi.getProducto(1);
    expect(despues.stock).toBe(antes.stock - 1);
  });

  // Prueba 9
  it("no deja comprar más unidades que el stock disponible", async () => {
    localStorage.setItem("token", "mock-token-3");
    const producto = await mockApi.getProducto(2);

    await expect(
      mockApi.crearPedido({
        productos: [{ id: 2, cantidad: producto.stock + 1 }],
        metodoPago: "EFECTIVO",
        tipoEntrega: "RETIRO_TIENDA",
        puntoRetiro: 1,
      })
    ).rejects.toThrow("Stock insuficiente");
  });

  // Prueba 10
  it("un pedido no puede saltar de EN_PREPARACION a ENTREGADO", async () => {
    localStorage.setItem("token", "mock-token-3");
    const pedido = await mockApi.crearPedido({
      productos: [{ id: 3, cantidad: 1 }],
      metodoPago: "TRANSFERENCIA",
      tipoEntrega: "DESPACHO",
      direccion: "Av. Libertad 123, Viña del Mar",
    });

    await expect(
      mockApi.actualizarEstadoPedido(pedido.id, "ENTREGADO")
    ).rejects.toThrow("No se permite cambiar a ese estado");

    const despachado = await mockApi.actualizarEstadoPedido(pedido.id, "DESPACHADO");
    expect(despachado.estado).toBe("DESPACHADO");
  });
});
