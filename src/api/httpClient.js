import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token vencido o inválido -> cerrar sesión
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    // El backend debe responder errores en JSON: { "mensaje": "..." }
    const mensaje = error.response?.data?.mensaje || "Error de comunicación con el servidor";
    return Promise.reject(new Error(mensaje));
  }
);

export default http;
