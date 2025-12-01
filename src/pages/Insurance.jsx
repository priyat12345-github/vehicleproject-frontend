import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./Insurance.css";

const Insurance = () => {
  const [fullName, setFullName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [insuranceType, setInsuranceType] = useState("Third Party");
  const [premium, setPremium] = useState(999);
  const [paid, setPaid] = useState(false);
  const [details, setDetails] = useState(null);

  const upiId = "priyamegalamane@oksbi";

  const createPaymentQR = () => {
    if (!fullName || !premium) return "";

    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      fullName
    )}&am=${premium}&cu=INR&tn=${encodeURIComponent(
      "Vehicle Insurance Payment"
    )}`;
  };

  const confirmPaid = async () => {
    if (!fullName || !vehicle) {
      alert("Please fill all fields first");
      return;
    }

    const res = await axios.post(
      "http://16.170.248.80:5001/api/insurance/pay",
      {
        name: fullName,
        vehicle,
        insuranceType,
        amount: premium,
      }
    );

    if (res.data.success) {
      setDetails(res.data.data);
      setPaid(true);
    }
  };

  return (
    <div className="insurance-wrapper">
      <div className="insurance-box">
        <h2>Insurance Payment</h2>

        {paid ? (
          <div>
            <h3>🎉 Payment Successful!</h3>

            <p><strong>Name:</strong> {details.name}</p>
            <p><strong>Vehicle:</strong> {details.vehicle}</p>
            <p><strong>Type:</strong> {details.insuranceType}</p>
            <p><strong>Amount:</strong> ₹{details.amount}</p>
            <p><strong>Date:</strong> {new Date(details.date).toLocaleString()}</p>

            <button
              onClick={() =>
                window.open(
                  `http://16.170.248.80:5001/api/insurance/receipt/${details._id}`
                )
              }
              className="insurance-btn download-btn"
            >
              Download Receipt
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              className="insurance-input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="text"
              className="insurance-input"
              placeholder="Vehicle Number"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            />

            <select
              className="insurance-select"
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value)}
            >
              <option>Third Party</option>
              <option>Comprehensive</option>
              <option>Renewal</option>
            </select>

            <input
              type="number"
              className="insurance-input"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
            />

            {fullName && vehicle && (
              <div>
                <h4 className="scan-title">Scan to Pay</h4>
                <QRCodeCanvas value={createPaymentQR()} size={220} />
                <p className="scan-sub">Scan using Google Pay / PhonePe</p>
              </div>
            )}

            <button onClick={confirmPaid} className="insurance-btn">
              I have completed the payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insurance;
