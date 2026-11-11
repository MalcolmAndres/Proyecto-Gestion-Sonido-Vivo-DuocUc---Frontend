import { readFileSync, writeFileSync } from "node:fs";

const origen = JSON.parse(readFileSync("../v1/data/instrumentos.json", "utf8"));

const productos = origen.map((p, i) => ({
  id: i + 1,
  codigo: p.id,
  nombre: p.nombre,
  marca: p.marca,
  modelo: p.modelo,
  categoria: p.categoria,
  precio: p.precio,
  stock: p.stock,
  descripcion: p.descripcion,
  imagenUrl: `https://placehold.co/400x300?text=${encodeURIComponent(p.categoria)}`,
  activo: p.disponible,
}));

writeFileSync("src/mocks/data/productos.json", JSON.stringify(productos, null, 2));
console.log(`Listo: ${productos.length} productos convertidos`);