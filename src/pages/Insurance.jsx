import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const Insurance = () => {
  const [fullName, setFullName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [insuranceType, setInsuranceType] = useState("Third Party");
  const [premium, setPremium] = useState(999);
  const [paid, setPaid] = useState(false);
  const [details, setDetails] = useState(null);

  // Your real UPI ID
  const upiId = "priyamegalamane@oksbi";

  // Generate UPI QR
  const createPaymentQR = () => {
    if (!fullName || !premium) return "";

    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      fullName
    )}&am=${premium}&cu=INR&tn=${encodeURIComponent(
      "Vehicle Insurance Payment"
    )}`;
  };

  // After payment (dummy confirm)
  const confirmPaid = async () => {
    if (!fullName || !vehicle) {
      alert("Please fill all fields first");
      return;
    }

    const res = await axios.post("http://16.170.248.80:5001/api/insurance/pay", {
      name: fullName,
      vehicle,
      insuranceType,
      amount: premium,
    });

    if (res.data.success) {
      setDetails(res.data.data); // Payment data including _id
      setPaid(true);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
      <h2>Insurance Payment</h2>

      {paid ? (
        // AFTER PAYMENT SUCCESS -------------------------------------------
        <div>
          <h3>🎉 Payment Successful!</h3>

          <p><strong>Name:</strong> {details.name}</p>
          <p><strong>Vehicle:</strong> {details.vehicle}</p>
          <p><strong>Type:</strong> {details.insuranceType}</p>
          <p><strong>Amount:</strong> ₹{details.amount}</p>
          <p><strong>Date:</strong> {new Date(details.date).toLocaleString()}</p>

          {/* DOWNLOAD RECEIPT BUTTON */}
          <button
            onClick={() =>
              window.open(
                `http://16.170.248.80:5001/api/insurance/receipt/${details._id}`
              )
            }
            style={{
              padding: "12px",
              width: "100%",
              background: "green",
              color: "white",
              borderRadius: "6px",
              marginTop: "20px",
            }}
          >
            Download Receipt
          </button>
        </div>
      ) : (
        // BEFORE PAYMENT ---------------------------------------------------
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <select
            value={insuranceType}
            onChange={(e) => setInsuranceType(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            <option>Third Party</option>
            <option>Comprehensive</option>
            <option>Renewal</option>
          </select>

          <input
            type="number"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          />

          {/* QR Code (Before Payment Only) */}
          {fullName && vehicle && (
            <div>
              <h4>Scan to Pay</h4>
              <QRCodeCanvas value={createPaymentQR()} size={220} />
              <p style={{ fontSize: "12px", marginTop: "10px" }}>
                Scan using Google Pay / PhonePe
              </p>
            </div>
          )}

          {/* Confirm Payment Button */}
          <button
            onClick={confirmPaid}
            style={{
              padding: "12px",
              width: "100%",
              background: "#1e293b",
              color: "white",
              borderRadius: "6px",
              marginTop: "20px",
            }}
          >
            I have completed the payment
          </button>
        </div>
      )}
    </div>
  );
};

export default Insurance;