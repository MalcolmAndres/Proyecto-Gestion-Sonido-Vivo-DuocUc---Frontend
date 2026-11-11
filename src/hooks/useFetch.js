import { useEffect, useState } from "react";

export function useFetch(funcion, dependencias = []) {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError(null);
    funcion()
      .then((resultado) => vigente && setData(resultado))
      .catch((e) => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [...dependencias, version]);

  const recargar = () => setVersion((v) => v + 1);

  return { data, cargando, error, recargar, setData };
}