// ===== ZONA 1: IMPORTS =====
import usuariosIniciales from "./data/usuarios.json";
import productosIniciales from "./data/productos.json";
import pedidosIniciales from "./data/pedidos.json";
import puntosRetiro from "./data/puntosRetiro.json";
// ===== ZONA 2: FUNCIONES DE AYUDA =====
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const cargar = (clave, inicial) => {
  try {
    const guardado = localStorage.getItem(`mock_${clave}`);
    return guardado ? JSON.parse(guardado) : structuredClone(inicial);
  } catch {
    return structuredClone(inicial);
  }
};

const guardar = (clave, valor) =>
  localStorage.setItem(`mock_${clave}`, JSON.stringify(valor));

const sinPassword = ({ password, ...resto }) => resto;

const siguienteId = (lista) => Math.max(0, ...lista.map((x) => x.id)) + 1;

// ===== ZONA 3: BASE DE DATOS EN MEMORIA =====
const db = {
  usuarios: cargar("usuarios", usuariosIniciales),
  productos: cargar("productos", productosIniciales),
  pedidos: cargar("pedidos", pedidosIniciales),
};
const usuarioDelToken = () => {
  const token = localStorage.getItem("token") || "";
  const id = Number(token.replace("mock-token-", ""));
  return db.usuarios.find((u) => u.id === id);
};

// ===== ZONA 4: API FALSA =====
export const mockApi = {

  async login({ email, password }) {
    await delay();
    const usuario = db.usuarios.find(
      (u) => u.email === email && u.password === password
    );
    if (!usuario) throw new Error("Correo o contraseña incorrectos");
    if (!usuario.activo) throw new Error("Tu cuenta está desactivada");
    return { token: `mock-token-${usuario.id}`, usuario: sinPassword(usuario) };
  },

  async registro({ nombre, email, password }) {
    await delay();
    if (db.usuarios.some((u) => u.email === email)) {
      throw new Error("Ese correo ya está registrado");
    }
    const nuevo = { id: siguienteId(db.usuarios), nombre, email, password, rol: "CLIENTE", activo: true };
    db.usuarios.push(nuevo);
    guardar("usuarios", db.usuarios);
    return { token: `mock-token-${nuevo.id}`, usuario: sinPassword(nuevo) };
  },

  async getUsuarios() {
    await delay();
    return db.usuarios.map(sinPassword);
  },

  async crearUsuario(datos) {
    await delay();
    if (db.usuarios.some((u) => u.email === datos.email)) {
      throw new Error("Ese correo ya está registrado");
    }
    const nuevo = { id: siguienteId(db.usuarios), activo: true, ...datos };
    db.usuarios.push(nuevo);
    guardar("usuarios", db.usuarios);
    return sinPassword(nuevo);
  },

  async actualizarUsuario(id, cambios) {
    await delay();
    const usuario = db.usuarios.find((u) => u.id === id);
    if (!usuario) throw new Error("Usuario no encontrado");
    Object.assign(usuario, cambios);
    guardar("usuarios", db.usuarios);
    return sinPassword(usuario);
  },

  

  async getProductos({ categoria = "", busqueda = "" } = {}) {
    await delay();

    const texto = busqueda.trim().toLowerCase();

    return db.productos.filter(
      (p) =>
        p.activo &&
        (!categoria || p.categoria === categoria) &&
        (!texto ||
          p.nombre.toLowerCase().includes(texto) ||
          p.marca.toLowerCase().includes(texto))
    );
  },

  async getProducto(id) {
    await delay();

    const producto = db.productos.find((p) => p.id === id);

    if (!producto) throw new Error("Producto no encontrado");

    return producto;
  },

  async getCategorias() {
    await delay(100);

    return [...new Set(db.productos.map((p) => p.categoria))];
  },

  async actualizarStock(id, stock) {
    await delay();

    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error("El stock debe ser un número entero, 0 o mayor");
    }

    const producto = db.productos.find((p) => p.id === id);

    if (!producto) throw new Error("Producto no encontrado");

    producto.stock = stock;

    guardar("productos", db.productos);

    return producto;
  },

  async getReporteVentas({ desde, hasta }) {
    await delay();

    const pedidos = (db.pedidos ?? []).filter((p) => {
      const dia = p.fecha.slice(0, 10);

      return (!desde || dia >= desde) && (!hasta || dia <= hasta);
    });

    return {
      cantidadPedidos: pedidos.length,
      totalVentas: pedidos.reduce((suma, p) => suma + p.total, 0),
      pedidos,
    };
  },


  async crearPedido(datos) {
    await delay();
    const cliente = usuarioDelToken();
    if (!cliente) throw new Error("Debes iniciar sesión para comprar.");

    // Comprobar que existan productos en el pedido
    if (!Array.isArray(datos.productos) || datos.productos.length === 0) {
      throw new Error("El pedido no contiene productos.");
    }

    // Agrupar cantidades por producto
    const cantidades = new Map();

    for (const item of datos.productos) {
      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        throw new Error("La cantidad de productos no es válida.");
      }

      cantidades.set(
        String(item.id),
        (cantidades.get(String(item.id)) || 0) + item.cantidad
      );
    }

    // Validar stock antes de registrar la compra
    for (const [id, cantidad] of cantidades) {
      const producto = db.productos.find(
        (p) => String(p.id) === id
      );

      if (!producto || !producto.activo) {
        throw new Error("Uno de los productos ya no está disponible.");
      }

      if (producto.stock < cantidad) {
        throw new Error(
          `Stock insuficiente para ${producto.nombre}. Disponibles: ${producto.stock}`
        );
      }
    }

    // Preparar los productos con el stock actualizado
    const productosActualizados = db.productos.map((producto) => {
      const cantidad = cantidades.get(String(producto.id)) || 0;

      return cantidad > 0
        ? { ...producto, stock: producto.stock - cantidad }
        : producto;
    });
    const productosPedido = [...cantidades].map(([id, cantidad]) => {
      const producto = db.productos.find((p) => String(p.id) === id);
      return { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad };
    });

    const nuevoPedido = {
      id: siguienteId(db.pedidos),
      usuarioId: cliente.id,
      clienteNombre: cliente.nombre,
      productos: productosPedido,
      total: productosPedido.reduce((suma, p) => suma + p.precio * p.cantidad, 0),
      metodoPago: datos.metodoPago,
      tipoEntrega: datos.tipoEntrega,
      direccion: datos.direccion ?? null,
      puntoRetiro: datos.puntoRetiro ?? null,
      fecha: new Date().toISOString(),
      estado: "EN_PREPARACION",
    };



    // Guardar los cambios
    db.productos = productosActualizados;
    db.pedidos.push(nuevoPedido);

    guardar("productos", db.productos);
    guardar("pedidos", db.pedidos);

    return nuevoPedido;
  },


  // Se obtienen los pedidos del cliente
 async getMisPedidos() {
    await delay();
    const cliente = usuarioDelToken();
    return db.pedidos.filter((pedido) => pedido.usuarioId === cliente?.id);
  },

  // Obtener todos los pedidos para el vendedor
  async getPedidos() {
    await delay();

    return [...db.pedidos];
  },

  // Actualizar el estado de un pedido
  async actualizarEstadoPedido(id, nuevoEstado) {
    await delay();

    const estadosPermitidos = [
      "EN_PREPARACION",
      "DESPACHADO",
      "ENTREGADO"
    ];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error("Estado de pedido no válido");
    }

    const pedido = db.pedidos.find(
      (p) => String(p.id) === String(id)
    );

    if (!pedido) {
      throw new Error("Pedido no encontrado");
    }

    const transicionesPermitidas = {

      EN_PREPARACION: "DESPACHADO",
      DESPACHADO: "ENTREGADO",
      ENTREGADO: null

    };

    if (transicionesPermitidas[pedido.estado] !== nuevoEstado) {
      throw new Error("No se permite cambiar a ese estado");
    }

    pedido.estado = nuevoEstado;

    guardar("pedidos", db.pedidos);

    return pedido;
  },
  async getPuntosRetiro() {
    await delay(100);
    return puntosRetiro;
  },

};