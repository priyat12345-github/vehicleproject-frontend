import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">

      <Link to="/" className="nav-link">Home</Link>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/signup" className="nav-link">Signup</Link>
      <Link to="/dashboard" className="nav-link">Dashboard</Link>

      <Link to="/insurance">
        <button className="nav-insurance-btn">Buy Insurance</button>
      </Link>

      {localStorage.getItem("token") && (
        <button onClick={handleLogout} className="nav-logout-btn">
          Logout
        </button>
      )}

    </nav>
  );
}
