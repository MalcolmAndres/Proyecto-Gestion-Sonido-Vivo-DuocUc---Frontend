
import { useState } from "react";
import Mapa from "../../components/Mapa";
import { useFetch } from "../../hooks/useFetch";
import { getPuntosRetiro } from "../../services/pedidosService";

export default function Ubicacion() {
  const [puntoSeleccionado, setPuntoSeleccionado] = useState("");
  const { data: puntosRetiro } = useFetch(getPuntosRetiro, []);

  return (
    <>
      <h2>Ubicaciones y puntos de retiro</h2>

      <p>
        Consulta nuestras ubicaciones y selecciona un punto de retiro
        para visualizarlo en el mapa.
      </p>

      <div className="mb-3">
        <label htmlFor="puntoRetiro" className="form-label">
          Seleccionar ubicación
        </label>

        <select
          id="puntoRetiro"
          className="form-select"
          value={puntoSeleccionado}
          onChange={(e) => setPuntoSeleccionado(e.target.value)}
        >
          <option value="">Seleccione una ubicación</option>

          {puntosRetiro?.map((punto) => (
            <option key={punto.id} value={punto.id}>
              {punto.nombre}
            </option>
          ))}
        </select>
      </div>

      <Mapa puntos={puntosRetiro} puntoSeleccionado={puntoSeleccionado} />

      <h3 className="mt-4">Nuestros puntos de retiro</h3>

      <div className="row g-3 mt-2">
        {puntosRetiro?.map((punto) => (
          <div className="col-12 col-md-6" key={punto.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{punto.nombre}</h5>
                <p className="card-text">{punto.direccion}</p>

                <button
                  className="btn btn-primario"
                  onClick={() =>
                    setPuntoSeleccionado(String(punto.id))
                  }
                >
                  Ver en el mapa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
