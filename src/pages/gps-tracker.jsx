import { useEffect } from "react";
import { useParams } from "react-router-dom";

function GpsTracker() {
  const { number } = useParams();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        fetch("https://backend-location.duckdns.org/api/updateLocation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number,
            latitude,
            longitude
          })
        });
      });
    }
  }, [number]);

  return <h2>GPS Tracking Active for {number}</h2>;
}

export default GpsTracker;