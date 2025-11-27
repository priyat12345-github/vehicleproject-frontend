import React, { useEffect, useState } from "react";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [upcomingExpiries, setUpcomingExpiries] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const BASE_URL = "https://backend-location.duckdns.org/api";

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

  // find vehicles expiring within 3 days
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

  // Emails sent today
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

  // Search + filter logic
  useEffect(() => {
    let data = vehicles;

    if (search.trim()) {
      data = data.filter(
        (v) =>
          v.number.toLowerCase().includes(search.toLowerCase()) ||
          v.owner?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "expiring") {
      data = upcomingExpiries;
    }

    setFilteredVehicles(data);
  }, [search, filter, vehicles, upcomingExpiries]);

  // Manual reminder
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

  if (loading)
    return <h2 style={{ textAlign: "center" }}>Loading dashboard...</h2>;

  return (
    <div style={{ padding: "30px", fontFamily: "Poppins, sans-serif" }}>
      <h2 style={{ color: "#2563eb", marginBottom: "10px" }}>📊 Vehicle Dashboard</h2>

      {/* Summary Cards */}
      <div style={cardContainer}>
        <SummaryCard color="#3b82f6" title="🚗 Total Vehicles" value={vehicles.length} />
        <SummaryCard color="#f97316" title="⚠️ Expiring Soon" value={upcomingExpiries.length} />
        <SummaryCard color="#10b981" title="📧 Emails Sent Today" value={emailsSentToday} />
      </div>

      {/* Search and Filter */}
      <div style={filterContainer}>
        <input
          type="text"
          placeholder="🔍 Search by vehicle number or owner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchStyle}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Vehicles</option>
          <option value="expiring">Expiring Soon</option>
        </select>
      </div>

      {/* Vehicle Table */}
      <table style={tableStyle}>
        <thead style={{ backgroundColor: "#f1f5f9" }}>
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
                    style={reminderButton}
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
      <section style={{ marginTop: "50px" }}>
        <h3>📧 Email Logs</h3>
        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead style={{ backgroundColor: "#f3f4f6" }}>
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
                  <td
                    style={{
                      color: log.status === "sent" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
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

/* -------------- Helper Components and Styles -------------- */
const SummaryCard = ({ color, title, value }) => (
  <div style={{ ...cardStyle, backgroundColor: color }}>
    <h3 style={{ fontSize: "18px" }}>{title}</h3>
    <p style={{ fontSize: "30px", fontWeight: "bold" }}>{value}</p>
  </div>
);

const cardContainer = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const cardStyle = {
  color: "white",
  borderRadius: "12px",
  width: "230px",
  textAlign: "center",
  padding: "15px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  margin: "10px",
};

const filterContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
};

const searchStyle = {
  padding: "10px",
  width: "300px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const selectStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "white",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const reminderButton = {
  backgroundColor: "#2563eb",
  color: "white",
  padding: "5px 10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

export default Dashboard;
