import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client"; 

// 🛑 CHANGE MADE HERE: Protocol changed to https
const SOCKET_SERVER_URL = "https://16.170.248.80:5001"; 

// Define custom marker icon (omitted for brevity)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper component to efficiently update the map and marker on location change
const MapUpdater = ({ location, markerRef }) => {
  const map = useMap(); 

  useEffect(() => {
    if (location) {
      const newLatLng = [location.latitude, location.longitude];
      const marker = markerRef.current;
      if (marker) {
        marker.setLatLng(newLatLng);
      }
      map.setView(newLatLng, map.getZoom()); 
    }
  }, [location, map, markerRef]); 
  
  return null; 
};


function LiveMap() {
  const { number } = useParams();
  const [location, setLocation] = useState(null);
  const markerRef = useRef(null); 

  // 1. Real-Time Socket.IO Listener
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("locationUpdate", (data) => {
      if (data.number === number) { 
        setLocation({ 
          latitude: data.latitude, 
          longitude: data.longitude, 
          timestamp: data.timestamp 
        });
      }
    });

    // Cleanup: Disconnect socket
    return () => {
      socket.disconnect();
    };
  }, [number]); 

  // 2. Initial Location Fetch 
  useEffect(() => {
    const fetchInitialLocation = async () => {
      try {
        // HTTP request uses the SOCKET_SERVER_URL base
        const res = await fetch(`${SOCKET_SERVER_URL}/api/getLocation?number=${number}`); 
        const data = await res.json();
        if (data.success) {
          setLocation(data.location);
        }
      } catch (error) {
        console.error("Could not fetch initial location:", error);
      }
    };
    fetchInitialLocation();
  }, [number]);
  

  if (!location) return <h2>Waiting for location data for {number}...</h2>;

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
          ref={markerRef} 
        >
          <Popup>
            **Vehicle: {number}**
            <br />
            Last Update: {new Date(location.timestamp).toLocaleTimeString()}
          </Popup>
        </Marker>

        <MapUpdater location={location} markerRef={markerRef} />
      </MapContainer>
    </div>
  );
}

export default LiveMap;