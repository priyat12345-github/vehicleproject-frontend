import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client"; 

// Server URL must match the backend setup
const SOCKET_SERVER_URL = "http://16.170.248.80:5001"; 

// Define custom marker icon
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

      // Update Marker Position using the ref
      const marker = markerRef.current;
      if (marker) {
        marker.setLatLng(newLatLng);
      }

      // Center the map view on the new location (optional)
      map.setView(newLatLng, map.getZoom()); 
    }
  }, [location, map, markerRef]); 
  
  return null; 
};


function LiveMap() {
  const { number } = useParams();
  const [location, setLocation] = useState(null);
  // Ref to hold the Leaflet Marker instance for efficient updates
  const markerRef = useRef(null); 

  // 1. Real-Time Socket.IO Listener
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    // Listen for location updates broadcast by the server
    socket.on("locationUpdate", (data) => {
      // Only update state if the data is for the vehicle this map is viewing
      if (data.number === number) {
        setLocation({ 
          latitude: data.latitude, 
          longitude: data.longitude, 
          timestamp: data.timestamp // Use the timestamp sent from server
        });
      }
    });

    // Cleanup: Disconnect socket
    return () => {
      socket.disconnect();
    };
  }, [number]); 

  // 2. Initial Location Fetch (from the API route we restored in server.js)
  useEffect(() => {
    const fetchInitialLocation = async () => {
      try {
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
        // Initial center using the latest available location
        center={[location.latitude, location.longitude]} 
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[location.latitude, location.longitude]}
          icon={markerIcon}
          // Pass the ref to the Marker component
          ref={markerRef} 
        >
          <Popup>
            **Vehicle: {number}**
            <br />
            Last Update: {new Date(location.timestamp).toLocaleTimeString()}
          </Popup>
        </Marker>

        {/* Component to handle map re-centering and marker updates on live data */}
        <MapUpdater location={location} markerRef={markerRef} />
      </MapContainer>
    </div>
  );
}

export default LiveMap;