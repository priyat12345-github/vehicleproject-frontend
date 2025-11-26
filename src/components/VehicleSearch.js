/*import React, { useState } from "react";

function VehicleSearch() {
  const [number, setNumber] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setVehicle(null);
    try {
      const res = await fetch("YOUR_BACKEND_URL/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number })
      });
      if (!res.ok) throw new Error("Vehicle not found");
      const data = await res.json();
      setVehicle(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Vehicle Number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Find Vehicle</button>

      {vehicle && (
        <div style={{
          marginTop: "20px", background: "#fff", padding: "20px",
          width: "300px", margin: "20px auto", borderRadius: "10px",
          boxShadow: "0 0 10px #aaa"
        }}>
          <h3>{vehicle.number}</h3>
          <p><b>Make:</b> {vehicle.make}</p>
          <p><b>Model:</b> {vehicle.model}</p>
          <p><b>Year:</b> {vehicle.year}</p>
          <p><b>Owner:</b> {vehicle.owner}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default VehicleSearch;*/

import React, { useState } from "react";
import axios from "axios";

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
        placeholder="Enter vehicle number (e.g., KA09AB1234)"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginRight: "10px",
          textTransform: "uppercase",
        }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
        Search
      </button>

      {loading && <p>⏳ Searching vehicle...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {vehicle && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
            margin: "20px auto",
            background: "#f9fafb",
          }}
        >
          <h3>📄 Vehicle Details</h3>
          <p><b>Number:</b> {vehicle.number}</p>
          <p><b>Make:</b> {vehicle.make || "N/A"}</p>
          <p><b>Model:</b> {vehicle.model || "N/A"}</p>
          <p><b>Year:</b> {vehicle.year || "N/A"}</p>
          <p><b>Owner:</b> {vehicle.owner || "N/A"}</p>
          <p>
            <b>Insurance Expiry:</b>{" "}
            {vehicle.insuranceExpiry
              ? new Date(vehicle.insuranceExpiry).toDateString()
              : "N/A"}
          </p>
          <p>
            <b>PUC Expiry:</b>{" "}
            {vehicle.pucExpiry
              ? new Date(vehicle.pucExpiry).toDateString()
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}

export default VehicleSearch;
