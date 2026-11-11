import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AvisoCarrito from "../components/AvisoCarrito";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
      <AvisoCarrito />
    </>
  );
}
