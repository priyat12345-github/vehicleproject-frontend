import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LiveMap() {
  const { number } = useParams();
  const [location, setLocation] = useState(null);

  // FIX: useCallback to avoid React warning
  const fetchLocation = useCallback(async () => {
    const res = await fetch(
      `https://backend-location.duckdns.org/api/getLocation?number=${number}`
    );
    const data = await res.json();

    if (data.success) {
      setLocation(data.location);
    }
  }, [number]);

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);

    return () => clearInterval(interval);
  }, [fetchLocation]);

  if (!location) return <h2>No location found for {number}</h2>;

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[location.latitude, location.longitude]}
          icon={markerIcon}
        >
          <Popup>Vehicle: {number}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LiveMap; 