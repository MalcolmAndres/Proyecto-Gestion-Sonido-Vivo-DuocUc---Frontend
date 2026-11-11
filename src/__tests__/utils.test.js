// Pruebas de las funciones de ayuda (utils). Son las más fáciles: entra un valor, sale otro.
import { formatPrecio } from "../utils/formato";
import { ROLES, INICIO_POR_ROL } from "../utils/roles";

describe("utils", () => {
  // Prueba 1
  it("formatPrecio muestra pesos chilenos con punto de miles", () => {
    expect(formatPrecio(15990)).toBe("$15.990");
  });

  // Prueba 2
  it("cada rol tiene una página de inicio", () => {
    Object.values(ROLES).forEach((rol) => {
      expect(INICIO_POR_ROL[rol]).toBeDefined();
    });
    expect(INICIO_POR_ROL.CLIENTE).toBe("/catalogo");
  });
});
