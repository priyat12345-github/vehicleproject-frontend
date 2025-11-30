import React from "react";
import { Link } from "react-router-dom";


export default function Navbar() {
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        backgroundColor: "#282c34",
        padding: "15px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
      <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
      <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link>
      <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
      <Link to="/insurance">
  <button style={{ padding: "10px", marginTop: "10px" }}>Buy Insurance</button>
</Link>


      {/* Logout button only if logged in */}
      {localStorage.getItem("token") && (
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            padding: "5px 10px",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}