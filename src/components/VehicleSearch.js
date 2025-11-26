import React, { useState } from "react";
import axios from "axios";
import LiveMap from "../pages/live-map";  // ⭐ Add import

function VehicleSearch() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [vehicleLocation, setVehicleLocation] = useState(null); // ⭐ Add state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!vehicleNumber.trim()) {
      setError("Please enter a vehicle number");
      return;
    }

    try {
      setError("");
      setVehicle(null);
      setVehicleLocation(null);
      setLoading(true);

      const formattedNumber = vehicleNumber.trim().toUpperCase();

      // Fetch vehicle details
      const response = await axios.get(
        `http://16.170.248.80:5001/api/vehicles/${formattedNumber}`
      );
      setVehicle(response.data);

      // ⭐ Fetch vehicle location
      const locationRes = await axios.get(
        `http://16.170.248.80:5001/api/getLocation?number=${formattedNumber}`
      );

      if (locationRes.data.success) {
        setVehicleLocation(locationRes.data.location);
      }

    } catch (err) {
      setError("❌ Vehicle not found or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🔍 Vehicle Search</h2>

      <input
        type="text"
        placeholder="Enter vehicle number"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        style={{ padding: "10px", width: "250px", marginRight: "10px" }}
      />

      <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
        Search
      </button>

      {loading && <p>⏳ Searching...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Vehicle details */}
      {vehicle && (
        <div style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          margin: "20px auto",
          background: "#f9fafb",
        }}>
          <h3>📄 Vehicle Details</h3>
          <p><b>Number:</b> {vehicle.number}</p>
          <p><b>Make:</b> {vehicle.make || "N/A"}</p>
          <p><b>Model:</b> {vehicle.model || "N/A"}</p>
          <p><b>Year:</b> {vehicle.year || "N/A"}</p>
          <p><b>Owner:</b> {vehicle.owner || "N/A"}</p>
          <p><b>Insurance Expiry:</b> {vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString() : "N/A"}</p>
          <p><b>PUC Expiry:</b> {vehicle.pucExpiry ? new Date(vehicle.pucExpiry).toLocaleDateString() : "N/A"}</p>
        </div>
      )}

      {/* ⭐ Live map below vehicle details */}
      {vehicleLocation && (
        <div style={{ marginTop: "20px" }}>
          <h3>📍 Live Location</h3>
          <LiveMap lat={vehicleLocation.latitude} lng={vehicleLocation.longitude} />
        </div>
      )}

    </div>
  );
}

export default VehicleSearch;
