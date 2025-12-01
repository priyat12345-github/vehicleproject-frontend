import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [upcomingExpiries, setUpcomingExpiries] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const BASE_URL = "http://16.170.248.80:5001/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [vehicleRes, logRes] = await Promise.all([
          fetch(`${BASE_URL}/vehicles`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/email-logs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [vehicleData, logData] = await Promise.all([
          vehicleRes.json(),
          logRes.json(),
        ]);

        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
        setEmailLogs(logData);
        findExpiringSoon(vehicleData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const findExpiringSoon = (data) => {
    const today = new Date();
    const limit = new Date();
    limit.setDate(today.getDate() + 3);
    const soon = data.filter((v) => {
      const insurance = v.insuranceExpiry && new Date(v.insuranceExpiry);
      const puc = v.pucExpiry && new Date(v.pucExpiry);
      return (
        (insurance && insurance <= limit && insurance >= today) ||
        (puc && puc <= limit && puc >= today)
      );
    });
    setUpcomingExpiries(soon);
  };

  const emailsSentToday = emailLogs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const today = new Date();
    return (
      logDate.getDate() === today.getDate() &&
      logDate.getMonth() === today.getMonth() &&
      logDate.getFullYear() === today.getFullYear() &&
      log.status === "sent"
    );
  }).length;

  useEffect(() => {
    let data = vehicles;

    if (search.trim()) {
      data = data.filter(
        (v) =>
          v.number.toLowerCase().includes(search.toLowerCase()) ||
          v.owner?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "expiring") data = upcomingExpiries;

    setFilteredVehicles(data);
  }, [search, filter, vehicles, upcomingExpiries]);

  const sendReminder = async (number) => {
    try {
      const res = await fetch(`${BASE_URL}/send-reminder/${number}`, {
        method: "POST",
      });
      const result = await res.json();
      alert(result.message || "Reminder sent!");
    } catch (err) {
      alert("Error sending reminder");
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading dashboard...</h2>;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Vehicle Dashboard</h2>

      {/* Summary Cards */}
      <div className="card-container">
        <div className="card" style={{ backgroundColor: "#3b82f6" }}>
          <h3 className="card-title">🚗 Total Vehicles</h3>
          <p className="card-value">{vehicles.length}</p>
        </div>

        <div className="card" style={{ backgroundColor: "#f97316" }}>
          <h3 className="card-title">⚠️ Expiring Soon</h3>
          <p className="card-value">{upcomingExpiries.length}</p>
        </div>

        <div className="card" style={{ backgroundColor: "#10b981" }}>
          <h3 className="card-title">📧 Emails Sent Today</h3>
          <p className="card-value">{emailsSentToday}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="🔍 Search by vehicle number or owner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select-box"
        >
          <option value="all">All Vehicles</option>
          <option value="expiring">Expiring Soon</option>
        </select>
      </div>

      {/* Vehicle Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Owner</th>
            <th>Make</th>
            <th>Model</th>
            <th>Insurance Expiry</th>
            <th>PUC Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No vehicles found.
              </td>
            </tr>
          ) : (
            filteredVehicles.map((v) => (
              <tr key={v._id}>
                <td>{v.number}</td>
                <td>{v.owner || "-"}</td>
                <td>{v.make || "-"}</td>
                <td>{v.model || "-"}</td>
                <td>{v.insuranceExpiry ? new Date(v.insuranceExpiry).toDateString() : "-"}</td>
                <td>{v.pucExpiry ? new Date(v.pucExpiry).toDateString() : "-"}</td>
                <td>
                  <button
                    onClick={() => sendReminder(v.number)}
                    className="reminder-btn"
                  >
                    Send Reminder 📩
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Email Logs */}
      <section className="email-section">
        <h3 className="email-title">📧 Email Logs</h3>
        <table className="email-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Recipient</th>
              <th>Status</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No email logs yet.
                </td>
              </tr>
            ) : (
              emailLogs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.vehicleNumber}</td>
                  <td>{log.to}</td>
                  <td className={log.status === "sent" ? "status-sent" : "status-failed"}>
                    {log.status.toUpperCase()}
                  </td>
                  <td>{log.subject}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Dashboard;
