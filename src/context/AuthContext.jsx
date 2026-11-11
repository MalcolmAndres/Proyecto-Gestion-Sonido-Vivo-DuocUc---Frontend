import { createContext, useState } from "react";
import * as authService from "../services/authService";
export const AuthContext = createContext(null);

const leerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuario);

  const guardarSesion = ({token,usuario}) =>{
    localStorage.setItem("token", token);
    localStorage.setItem("usuario",JSON.stringify(usuario));
    setUsuario(usuario);
    return usuario;
  }
  ;
  const login = async (email,password) =>{
  const respuesta = await authService.login({email,password});
    return guardarSesion(respuesta);
  };
  const registro = async(datos) =>{
    const respuesta = await authService.registro(datos);
    return guardarSesion(respuesta);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("carrito");
    setUsuario(null);
  };

  const tieneRol = (...roles) => !!usuario && roles.includes(usuario.rol);

  return (
    <AuthContext.Provider value={{ usuario, login, registro,logout, tieneRol }}>
      {children}
    </AuthContext.Provider>
  );

}
