import { render, screen } from "@testing-library/react";
import EstadoBadge from "../components/EstadoBadge";

describe("EstadoBadge", () => {
  // Prueba 11
  it("muestra el texto bonito y el color del estado", () => {
    render(<EstadoBadge estado="DESPACHADO" />);

    const badge = screen.getByText("Despachado");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-info");
  });
});
