import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import VehicleSearch from "./components/VehicleSearch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Insurance from "./pages/Insurance";   // ⭐ NEW: Insurance
import EmailLogs from "./pages/EmailLogs";   // ⭐ NEW: Email Logs
import AddVehicle from "./pages/AddVehicle"; // ⭐ NEW: Add Vehicle
import SendReminder from "./pages/SendReminder"; // ⭐ NEW: Send Reminder
import GpsTracker from "./pages/gps-tracker";
import LiveMap from "./pages/live-map";

function App() {
  return (
    <Router>
      {/* Navbar shown on all pages */}
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>🚗 Vehicle Info Finder</h1>

        <Routes>

          {/* HOME → Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VehicleSearch />
              </ProtectedRoute>
            }
          />

          {/* LOGIN + SIGNUP */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* DASHBOARD → Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW: Insurance Payment Page → Protected */}
          <Route
            path="/insurance"
            element={
              <ProtectedRoute>
                <Insurance />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW: Email Logs Page → Protected */}
          <Route
            path="/email-logs"
            element={
              <ProtectedRoute>
                <EmailLogs />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW: Add Vehicle Page → Protected */}
          <Route
            path="/add-vehicle"
            element={
              <ProtectedRoute>
                <AddVehicle />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW: Send Reminder Page → Protected */}
          <Route
            path="/send-reminder"
            element={
              <ProtectedRoute>
                <SendReminder />
              </ProtectedRoute>
            }
          />

          {/* GPS TRACKING */}
          <Route path="/gps-tracker/:number" element={<GpsTracker />} />
          <Route path="/live-map/:number" element={<LiveMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
