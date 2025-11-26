import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client"; 

// Server URL must match the backend setup
const SOCKET_SERVER_URL = "http://16.170.248.80:5001"; 

function GpsTracker() {
  const { number } = useParams();

  useEffect(() => {
    // Establish Socket.IO connection
    const socket = io(SOCKET_SERVER_URL);
    
    // Check if Geolocation is available
    if ("geolocation" in navigator) {

      // 1. Success handler: Sends position via Socket.IO
      const positionSuccess = (pos) => {
        const locationData = {
          number,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        
        // Use socket.emit() to send the real-time update
        socket.emit("sendLocation", locationData); 
      };

      // 2. Error handler for permission issues
      const positionError = (error) => {
        console.error("Geolocation Error:", error.message);
        // Alert the user to enable permissions (crucial for mobile devices)
        alert(`Error getting location: ${error.message}. Please enable GPS and location permissions.`);
      };

      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      // Start continuous watching
      const watchId = navigator.geolocation.watchPosition(
        positionSuccess,
        positionError,
        options
      );

      // Cleanup function: stop watching and disconnect
      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.disconnect();
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [number]);

  return (
    <div>
      <h2>GPS Tracking Active for Vehicle: **{number}** 🚦</h2>
      <p>Updates are being sent in real-time. Do not close this page on the device you wish to track.</p>
    </div>
  );
}

export default GpsTracker;