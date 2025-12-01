/*import React, { useState } from "react";
import axios from "axios";
import "./Home.css"; // <-- add this

function VehicleSearch() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicle, setVehicle] = useState(null);
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
      setLoading(true);

      const formattedNumber = vehicleNumber.trim().toUpperCase();

      const response = await axios.get(
        `http://16.170.248.80:5001/api/vehicles/${formattedNumber}`
      );
      setVehicle(response.data);

      const locationRes = await axios.get(
        `http://16.170.248.80:5001/api/getLocation?number=${formattedNumber}`
      );

    

  return (
    <div className="home-wrapper">
      <h2>🔍 Vehicle Search</h2>

      <input
        type="text"
        placeholder="Enter vehicle number"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        className="home-input"
      />

      <button onClick={handleSearch} className="home-btn">
        Search
      </button>

      {loading && <p className="home-loading">⏳ Searching...</p>}
      {error && <p className="home-error">{error}</p>}

      {vehicle && (
        <div className="vehicle-card">
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

    </div>
  );
}
  
export default VehicleSearch;*/

import React, { useState } from "react";
import axios from "axios";
import "./Home.css";

function VehicleSearch() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicle, setVehicle] = useState(null);
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
      setLoading(true);

      const formattedNumber = vehicleNumber.trim().toUpperCase();

      // Fetch vehicle details
      const response = await axios.get(
        `http://16.170.248.80:5001/api/vehicles/${formattedNumber}`
      );

      setVehicle(response.data);

      // Optional: you can add map later
      // const locationRes = await axios.get(
      //   `http://16.170.248.80:5001/api/getLocation?number=${formattedNumber}`
      // );
      // setVehicleLocation(locationRes.data.location);

    } catch (err) {
      setError("❌ Vehicle not found or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <h2>🔍 Vehicle Search</h2>

      <input
        type="text"
        placeholder="Enter vehicle number"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        className="home-input"
      />

      <button onClick={handleSearch} className="home-btn">
        Search
      </button>

      {loading && <p className="home-loading">⏳ Searching...</p>}
      {error && <p className="home-error">{error}</p>}

      {vehicle && (
        <div className="vehicle-card">
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
    </div>
  );
}

export default VehicleSearch;

