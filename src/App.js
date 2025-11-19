import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VehicleSearch from "./components/VehicleSearch";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      {/* ✅ Navbar appears on all pages */}
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>🚗 Vehicle Info Finder</h1>

        <Routes>
          {/* 🟢 Home (protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VehicleSearch />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
           path="/dashboard"
            element={
          <ProtectedRoute>
           <Dashboard />
           </ProtectedRoute>
  }
/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
