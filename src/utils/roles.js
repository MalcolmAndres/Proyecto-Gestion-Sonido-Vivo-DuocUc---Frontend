// Deben coincidir EXACTO con el enum Rol en Java.
export const ROLES = {
  ADMIN: "ADMIN",
  VENDEDOR: "VENDEDOR",
  CLIENTE: "CLIENTE",
};

export const NOMBRE_ROL = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente",
};

// Página a la que se envía a cada rol después de iniciar sesión
export const INICIO_POR_ROL = {
  ADMIN: "/admin/usuarios",
  VENDEDOR: "/gestion/pedidos",
  CLIENTE: "/catalogo",
};
