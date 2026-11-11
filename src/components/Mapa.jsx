import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const iconoMarcador = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});




function CentrarMapa({ puntos, puntoSeleccionado }) {
    const map = useMap();

    useEffect(() => {
        const punto = puntos?.find(
            (item) => String(item.id) === String(puntoSeleccionado)
        );

        if (punto) {
            map.flyTo(
                [punto.latitud, punto.longitud],
                15,
                { duration: 1 }
            );
        }
    }, [puntos,puntoSeleccionado, map]);

    return null;
}

export default function Mapa({ puntos,puntoSeleccionado }) {

    return (
        <div className="mt-4">

            <h4>Ubicaciones y puntos de retiro</h4>

            <MapContainer
                center={[-33.025, -71.58]}
                zoom={12}
                style={{ height: "400px", width: "100%" }}
            >
                <CentrarMapa puntos={puntos} puntoSeleccionado={puntoSeleccionado}/>

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Muestra los puntos de retiro disponibles */}
                {puntos?.map((punto) => (
                    <Marker
                        key={punto.id}
                        position={[punto.latitud, punto.longitud]}
                        icon={iconoMarcador}
                    >
                        <Popup>

                            <strong>{punto.nombre}</strong>

                            <p>{punto.direccion}</p>

                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${punto.latitud},${punto.longitud}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Cómo llegar

                            </a>

                        </Popup>

                    </Marker>
                ))}

            </MapContainer>

        </div>
    );
}